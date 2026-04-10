'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Send, Image, X } from 'lucide-react'

interface MessageInputProps {
  onSend: (message: string, imageUrl?: string) => void
  disabled?: boolean
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [input, setInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!input.trim() && !imageUrl) return
    if (disabled) return

    onSend(input.trim(), imageUrl || undefined)
    setInput('')
    setImageUrl('')
    setShowImageInput(false)
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    
    // 자동 높이 조절
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  return (
    <div className="border-t border-claude-border bg-white">
      <div className="max-w-3xl mx-auto p-4">
        {showImageInput && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Image size={16} className="text-claude-text-secondary" />
              <span className="text-sm font-medium text-claude-text">이미지 URL</span>
              <button
                onClick={() => {
                  setShowImageInput(false)
                  setImageUrl('')
                }}
                className="ml-auto p-1 hover:bg-gray-200 rounded"
              >
                <X size={16} />
              </button>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-claude-accent"
            />
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-xs max-h-32 rounded border border-gray-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setShowImageInput(!showImageInput)}
            disabled={disabled}
            className="p-3 hover:bg-claude-hover rounded-lg transition-colors disabled:opacity-50"
            title="이미지 추가"
          >
            <Image size={20} className="text-claude-text-secondary" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 pr-12 border border-claude-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-claude-accent disabled:bg-gray-50 disabled:text-gray-400"
              style={{ minHeight: '48px', maxHeight: '200px' }}
            />
            
            <button
              onClick={handleSubmit}
              disabled={disabled || (!input.trim() && !imageUrl)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-claude-accent text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="전송"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-claude-text-secondary text-center">
          Claude Chat은 MISO API를 사용합니다
        </div>
      </div>
    </div>
  )
}
