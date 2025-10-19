import { NextResponse } from 'next/server'
import { getBrandById, getPromptsByBrandId } from '@/lib/supabase/queries'
import { createLLMRunsBatch, createScoresLLMBatch, createScoreOverall } from '@/lib/supabase/queries'
import { runAllLLMs } from '@/lib/llm/llm-runner'
import { computeScores } from '@/lib/llm/compute-scores'
import { formatErrorResponse, AppError } from '@/lib/utils/errors'
import { ApiErrorCode } from '@/types/api'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { brandId } = body

    if (!brandId) {
      return NextResponse.json(
        formatErrorResponse(
          new AppError(400, 'Brand ID is required', ApiErrorCode.VALIDATION_ERROR)
        ),
        { status: 400 }
      )
    }

    // Fetch brand and prompts
    const [brand, prompts] = await Promise.all([
      getBrandById(brandId),
      getPromptsByBrandId(brandId),
    ])

    // Validate prerequisites
    if (prompts.length === 0) {
      return NextResponse.json(
        formatErrorResponse(
          new AppError(
            400,
            'At least one prompt is required for analysis',
            ApiErrorCode.VALIDATION_ERROR
          )
        ),
        { status: 400 }
      )
    }

    console.log(`Starting analysis for brand ${brand.brand_name} with ${prompts.length} prompts`)

    // Step 0: Delete old LLM runs for these prompts (to allow re-analysis)
    const { supabase } = await import('@/lib/supabase/client')
    await supabase
      .from('llm_runs')
      .delete()
      .in('prompt_id', prompts.map(p => p.id))

    // Step 1: Run all LLMs in parallel
    const { llm_runs, errors } = await runAllLLMs(brand, prompts)

    if (llm_runs.length === 0) {
      throw new Error('All LLM requests failed')
    }

    // Step 2: Save LLM runs to database
    const savedRuns = await createLLMRunsBatch(llm_runs)

    // Step 3: Compute scores
    const scoringOutput = computeScores(brand, prompts, savedRuns)

    // Step 4: Save scores to database
    const llmScores = [
      { brand_id: brandId, llm: 'chatgpt' as const, ...scoringOutput.per_llm.chatgpt },
      { brand_id: brandId, llm: 'gemini' as const, ...scoringOutput.per_llm.gemini },
      { brand_id: brandId, llm: 'perplexity' as const, ...scoringOutput.per_llm.perplexity },
    ]

    await createScoresLLMBatch(llmScores)

    const overallScore = await createScoreOverall({
      brand_id: brandId,
      ...scoringOutput.overall,
    })

    console.log(`Analysis complete: ${llm_runs.length} runs, ${errors.length} errors`)

    return NextResponse.json(
      {
        success: true,
        runs_count: llm_runs.length,
        errors_count: errors.length,
        errors: errors.length > 0 ? errors : undefined,
        overall_score: overallScore,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      formatErrorResponse(error),
      { status: error.status || 500 }
    )
  }
}
