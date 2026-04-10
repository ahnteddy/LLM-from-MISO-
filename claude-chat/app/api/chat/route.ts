import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiKey = process.env.MISO_API_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: 'API 키가 설정되지 않았습니다. .env.local 파일에 MISO_API_KEY를 추가해주세요.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const response = await fetch('https://api.holdings.miso.gs/ext/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      const errorMessages: Record<string, string> = {
        'conversation_not_found': '요청한 대화를 찾을 수 없습니다. 새 채팅을 시작해주세요.',
        'invalid_param': '잘못된 요청입니다. 입력 형식을 확인해주세요.',
        'app_unavailable': '앱을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.',
        'provider_not_initialize': '모델 인증 정보가 설정되지 않았습니다.',
        'model_currently_not_support': '현재 모델을 사용할 수 없습니다.',
        'completion_request_error': '응답 생성에 실패했습니다.',
        'internal_server_error': '서버 내부 오류가 발생했습니다.',
      }

      const errorCode = errorData.code || 'unknown'
      const errorMessage = errorMessages[errorCode] || errorData.message || '알 수 없는 오류가 발생했습니다.'

      return new Response(
        JSON.stringify({
          error: errorMessage,
          code: errorCode,
          detail: errorData.detail
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 스트리밍 응답 반환
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(
      JSON.stringify({
        error: '요청 처리 중 오류가 발생했습니다.',
        detail: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
