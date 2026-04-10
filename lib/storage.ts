import { Conversation } from './types';

export const storageKeys = {
  conversations: 'claude_conversations',
  currentConversation: 'claude_current_conversation',
} as const;

export const storage = {
  getConversations(): Conversation[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(storageKeys.conversations);
    return stored ? JSON.parse(stored) : [];
  },

  saveConversation(conversation: Conversation): void {
    if (typeof window === 'undefined') return;
    const conversations = this.getConversations();
    const index = conversations.findIndex(c => c.id === conversation.id);
    
    if (index >= 0) {
      conversations[index] = conversation;
    } else {
      conversations.unshift(conversation);
    }
    
    localStorage.setItem(storageKeys.conversations, JSON.stringify(conversations));
  },

  deleteConversation(id: string): void {
    if (typeof window === 'undefined') return;
    const conversations = this.getConversations().filter(c => c.id !== id);
    localStorage.setItem(storageKeys.conversations, JSON.stringify(conversations));
  },

  getCurrentConversationId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(storageKeys.currentConversation);
  },

  setCurrentConversationId(id: string | null): void {
    if (typeof window === 'undefined') return;
    if (id) {
      localStorage.setItem(storageKeys.currentConversation, id);
    } else {
      localStorage.removeItem(storageKeys.currentConversation);
    }
  }
};
