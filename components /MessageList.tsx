'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message } from '@/lib/types'
import CodeBlock from './CodeBlock'
import ImagePreview from './ImagePreview'
import { User, Bot } from 'lucide-react'

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-claude-text-secondary">
        메시지를 입력하여 대화를 시작하세요
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-8 px-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-8 ${
              message.role === 'user' ? 'ml-auto' : ''
            }`}
          >
            <div className="flex gap-4">
              {/* 아바타 */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-claude-accent text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {message.role === 'user' ? (
                  <User size={18} />
                ) : (
                  <Bot size={18} />
                )}
              </div>

              {/* 메시지 내용 */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-claude-text-secondary mb-2">
                  {message.role === 'user' ? '사용자' : 'Assistant'}
                </div>
                
                {message.image && (
                  <ImagePreview url={message.image.url} />
                )}

                {message.role === 'user' ? (
                  <div className="text-claude-text whitespace-pre-wrap">
                    {message.content}
                  </div>
                ) : (
                  <div className="markdown prose max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '')
                          const codeString = String(children).replace(/\n$/, '')
                          
                          return !inline && match ? (
                            <CodeBlock
                              language={match[1]}
                              code={codeString}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        },
                      }}
                    >
                      {message.content || (message.isStreaming ? '생각하는 중...' : '')}
                    </ReactMarkdown>
                  </div>
                )}

                {message.isStreaming && (
                  <span className="inline-block w-2 h-4 bg-claude-accent ml-1 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
