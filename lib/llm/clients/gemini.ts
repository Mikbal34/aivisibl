import { LLMSource } from '@/types/llm'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not configured')
}

export interface GeminiResponse {
  response_text: string
  sources: LLMSource[]
}

export async function queryGemini(prompt: string): Promise<GeminiResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful assistant that provides detailed, well-researched answers. ALWAYS include relevant website URLs and sources in your response. Format URLs clearly. Include at least 3-5 authoritative sources with their full URLs.\n\n${prompt}\n\nPlease include relevant website URLs and sources in your answer.`
                }
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Gemini doesn't provide ranked sources by default
    // We'll extract URLs from the response text
    const sources: LLMSource[] = extractUrlsFromText(text)

    return {
      response_text: text,
      sources,
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    throw error
  }
}

function extractUrlsFromText(text: string): LLMSource[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = text.match(urlRegex) || []

  return matches.map((url, index) => ({
    url: url.replace(/[.,;!?)]$/, ''), // Remove trailing punctuation
    rank: index + 1,
  }))
}
