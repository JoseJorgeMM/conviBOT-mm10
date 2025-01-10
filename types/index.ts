export interface Message {
  content: string;
  type: 'user-message' | 'bot-message' | 'typing-indicator' | 'bot-message error';
}

export interface ConversationHistory {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

