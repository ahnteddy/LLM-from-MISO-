import { Conversation } from './types'

const STORAGE_KEY = 'claude_conversations'

export const storage = {
  getConversations(): Conversation[] {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  saveConversations(conversations: Conversation[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  },

  addConversation(conversation: Conversation): void {
    const conversations = this.getConversations()
    conversations.unshift(conversation)
    this.saveConversations(conversations)
  },

  updateConversation(id: string, updates: Partial<Conversation>): void {
    const conversations = this.getConversations()
    const index = conversations.findIndex(c => c.id === id)
    if (index !== -1) {
      conversations[index] = { ...conversations[index], ...updates }
      this.saveConversations(conversations)
    }
  },

  deleteConversation(id: string): void {
    const conversations = this.getConversations().filter(c => c.id !== id)
    this.saveConversations(conversations)
  },

  getConversation(id: string): Conversation | undefined {
    return this.getConversations().find(c => c.id === id)
  }
}
