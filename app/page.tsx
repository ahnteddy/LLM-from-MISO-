'use client'

import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import ChatSidebar from '@/components/ChatSidebar'
import ChatArea from '@/components/ChatArea'
import { Conversation } from '@/lib/types'
import { storage } from '@/lib/storage'

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  useEffect(() => {
    setConversations(storage.getConversations())
  }, [])

  const currentConversation = conversations.find(c => c.id === currentConversationId)

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: nanoid(),
      conversation_id: null,
      title: '새 채팅',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    
    storage.addConversation(newConversation)
    setConversations(storage.getConversations())
    setCurrentConversationId(newConversation.id)
  }

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id)
  }

  const handleDeleteConversation = (id: string) => {
    storage.deleteConversation(id)
    setConversations(storage.getConversations())
    if (currentConversationId === id) {
      setCurrentConversationId(null)
    }
  }

  const handleUpdateConversation = (id: string, updates: Partial<Conversation>) => {
    storage.updateConversation(id, updates)
    setConversations(storage.getConversations())
  }

  return (
    <div className="flex h-screen bg-claude-bg">
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
      />
      <ChatArea
        conversation={currentConversation}
        onUpdateConversation={handleUpdateConversation}
        onNewChat={handleNewChat}
      />
    </div>
  )
}
