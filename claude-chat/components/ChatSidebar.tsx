'use client'

import { MessageSquarePlus, Trash2, MessageSquare } from 'lucide-react'
import { Conversation } from '@/lib/types'

interface ChatSidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
}

export default function ChatSidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: ChatSidebarProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return '오늘'
    if (days === 1) return '어제'
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
  }

  return (
    <div className="w-64 bg-claude-sidebar border-r border-claude-border flex flex-col">
      {/* 헤더 */}
      <div className="p-4 border-b border-claude-border">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-2.5 bg-claude-accent text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <MessageSquarePlus size={18} />
          <span className="font-medium">새 채팅</span>
        </button>
      </div>

      {/* 채팅 목록 */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-claude-text-secondary text-sm">
            채팅 기록이 없습니다
          </div>
        ) : (
          <div className="py-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative mx-2 mb-1 rounded-lg transition-colors ${
                  currentConversationId === conv.id
                    ? 'bg-claude-hover'
                    : 'hover:bg-claude-hover'
                }`}
              >
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className="w-full text-left px-3 py-2.5 pr-10"
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare size={16} className="mt-1 text-claude-text-secondary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-claude-text truncate">
                        {conv.title}
                      </div>
                      <div className="text-xs text-claude-text-secondary mt-0.5">
                        {formatDate(conv.updatedAt)}
                      </div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteConversation(conv.id)
                  }}
                  className="absolute right-2 top-2.5 p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-opacity"
                  title="삭제"
                >
                  <Trash2 size={14} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="p-4 border-t border-claude-border text-xs text-claude-text-secondary">
        Claude Chat v1.0
      </div>
    </div>
  )
}
