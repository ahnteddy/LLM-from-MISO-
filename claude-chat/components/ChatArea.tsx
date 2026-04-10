'use client'

import { useState } from 'react'
import { nanoid } from 'nanoid'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { Conversation, Message } from '@/lib/types'

interface ChatAreaProps {
  conversation: Conversation | undefined
  onUpdateConversation: (id: string, updates: Partial<Conversation>) => void
  onNewChat: () => void
}

export default function ChatArea({
  conversation,
  onUpdateConversation,
  onNewChat,
}: ChatAreaProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendMessage = async (
    content: string,
    imageUrl?: string
  ) => {
    if (!conversation) {
      onNewChat()
      return
    }

    setError(null)
    setIsLoading(true)

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
      image: imageUrl ? { url: imageUrl, type: 'remote_url' } : undefined,
      timestamp: Date.now(),
    }

    const updatedMessages = [...conversation.messages, userMessage]
    
    // AI 메시지 플레이스홀더
    const assistantMessage: Message = {
      id: nanoid(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    }

    onUpdateConversation(conversation.id, {
      messages: [...updatedMessages, assistantMessage],
      updatedAt: Date.now(),
    })

    try {
      const requestBody = {
        query: content,
        mode: 'streaming',
        conversation_id: conversation.conversation_id || '',
        user: 'user-' + nanoid(),
        inputs: {},
        ...(imageUrl && {
          files: [
            {
              type: 'image' as const,
              transfer_method: 'remote_url' as const,
              url: imageUrl,
            },
          ],
        }),
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '응답을 받을 수 없습니다.')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''
      let newConversationId = conversation.conversation_id

      if (!reader) throw new Error('스트림을 읽을 수 없습니다.')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data:')) {
            try {
              const jsonStr = line.slice(5).trim()
              if (jsonStr === '[DONE]') continue
              if (!jsonStr) continue

              const data = JSON.parse(jsonStr)

              if (data.event === 'agent_message' || data.event === 'message') {
                accumulatedContent += data.answer || ''
                
                assistantMessage.content = accumulatedContent
                onUpdateConversation(conversation.id, {
                  messages: [...updatedMessages, { ...assistantMessage }],
                })
              }

              if (data.conversation_id && !newConversationId) {
                newConversationId = data.conversation_id
              }
            } catch (e) {
              console.error('JSON 파싱 오류:', e)
            }
          }
        }
      }

      // 스트리밍 완료
      assistantMessage.isStreaming = false
      assistantMessage.content = accumulatedContent

      // 대화 제목 자동 생성 (첫 메시지인 경우)
      const title = conversation.title === '새 채팅' && content.length > 0
        ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
        : conversation.title

      onUpdateConversation(conversation.id, {
        conversation_id: newConversationId,
        messages: [...updatedMessages, assistantMessage],
        title,
        updatedAt: Date.now(),
      })

    } catch (error) {
      console.error('Chat error:', error)
      setError(error instanceof Error ? error.message : '오류가 발생했습니다.')
      
      // 에러 발생 시 AI 메시지 제거
      onUpdateConversation(conversation.id, {
        messages: updatedMessages,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <h2 className="text-2xl font-semibold text-claude-text mb-2">
            Claude Chat
          </h2>
          <p className="text-claude-text-secondary mb-6">
            새 채팅을 시작하세요
          </p>
          <button
            onClick={onNewChat}
            className="px-6 py-2.5 bg-claude-accent text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            새 채팅 시작
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <MessageList messages={conversation.messages} />
      
      {error && (
        <div className="mx-auto max-w-3xl w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <div className="text-red-800 text-sm">
            <strong>오류:</strong> {error}
          </div>
        </div>
      )}
      
      <MessageInput
        onSend={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  )
}
