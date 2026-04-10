// app/api/chat/route.ts
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { messages, files } = await req.json()

    const response = await fetch('https://api.holdings.miso.gs/ext/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MISO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: messages[messages.length - 1].content,
        response_mode: 'streaming',
        conversation_id: '',
        user: 'user',
        files: files || []
      }),
    })

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
