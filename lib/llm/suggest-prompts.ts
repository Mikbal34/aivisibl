import { openai } from './client'
import { Brand } from '@/types/brand'

export async function generatePromptSuggestions(
  brand: Brand,
  count: number = 5
): Promise<string[]> {
  try {
    const userPrompt = `Generate ${count} visibility-testing prompts for this brand:

Brand: ${brand.brand_name}
Region: ${brand.region || 'Global (infer from brand)'}

Remember:
- DO NOT include the brand name in any prompt
- Understand the industry automatically
- Create natural, indirect questions
- Keep under 15 words each`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an intelligent prompt generator that automatically creates short, visibility-oriented questions to test how prominently a brand appears in AI responses.

Goal:
Generate natural, indirect prompts that reveal the AI's perception of a given brand *without mentioning the brand or domain.*

Input:
- brand_name (e.g. "Turkcell")
- optional: region (e.g. "Turkey", "Europe")

Your task:
1. Understand what sector or industry the brand belongs to (e.g. telecom, banking, fashion, etc.).
2. Understand the region if not given (use the brand's origin or primary market).
3. Generate 5–10 short prompts that indirectly assess the brand's visibility within its market.

Rules:
1. NEVER include the brand name or domain.
2. Prompts should sound like normal user queries to an AI model.
3. Keep each under 15 words.
4. Mix discovery, ranking, and comparison styles.
5. Focus on brand-related topics: popularity, leadership, trust, quality, innovation, and customer choice.
6. Always adapt tone and examples to the brand's sector and region.

Example Input:
{
  "brand_name": "Turkcell"
}

Example Output:
{
  "brand": "Turkcell",
  "inferred_industry": "mobile telecommunications",
  "inferred_region": "Turkey",
  "prompts": [
    "Who are the leading mobile operators in Turkey?",
    "Which telecom companies offer the best coverage in Turkey?",
    "Top mobile internet providers in Turkey",
    "Which 5G operators are most preferred by users in Turkey?",
    "Who dominates the mobile network market in Turkey?"
  ]
}

Output format (JSON):
{
  "prompts": [
    "prompt 1",
    "prompt 2",
    ...
  ]
}`,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 800,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the response - GPT should return {questions: [...]} or just [...]
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (e) {
      throw new Error(`Failed to parse OpenAI response: ${content}`)
    }

    // Handle both array and object responses
    const questions = Array.isArray(parsed)
      ? parsed
      : parsed.questions || parsed.prompts || Object.values(parsed)

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid response format from OpenAI')
    }

    return questions.slice(0, count).map((q) => String(q))
  } catch (error) {
    console.error('Error generating prompt suggestions:', error)
    throw error
  }
}
