export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: {
    url: string
    type: 'remote_url' | 'local_file'
  }
  timestamp: number
  isStreaming?: boolean
}

export interface Conversation {
  id: string
  conversation_id: string | null
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export interface ChatRequest {
  query: string
  mode: 'streaming' | 'blocking'
  conversation_id?: string
  user: string
  inputs?: Record<string, any>
  files?: Array<{
    type: 'image'
    transfer_method: 'remote_url' | 'local_file'
    url?: string
    upload_file_id?: string
  }>
}

export interface ChatResponse {
  id: string
  conversation_id: string
  answer: string
  agent_thoughts?: any[]
  created_at: string
}

export interface ErrorResponse {
  code: string
  message: string
  detail?: string
}
