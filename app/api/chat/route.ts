import { streamText, convertToModelMessages } from 'ai'
import { groq } from '@ai-sdk/groq'
import { openai } from '@ai-sdk/openai'
import { SYSTEM_PROMPT } from '@/lib/prompt'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const { messages } = await req.json()

  let model
  if (process.env.OPENAI_API_KEY) {
    model = openai('gpt-4o-mini')
  } else if (process.env.GROQ_API_KEY) {
    model = groq('llama-3.3-70b-versatile')
  } else {
    return new Response(
      'No AI API key configured. Add OPENAI_API_KEY or GROQ_API_KEY to .env.local',
      { status: 500 }
    )
  }

  const result = streamText({
    model,
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 4096,
    temperature: 0.7,
    onFinish: ({ finishReason, usage }) => {
      console.log('[chat] finish_reason:', finishReason, '| tokens:', JSON.stringify(usage))
    },
  })

  return result.toUIMessageStreamResponse()
}
