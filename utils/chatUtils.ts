import { Message, ConversationHistory } from '../types';
import { speakText } from './speechUtils';

export const MANUAL_DE_CONVIVENCIA_TEXT = `...`; // Your full text here

export function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export function retrieveRelevantContext(question: string, chunks: string[], topK = 3): string[] {
  const lowercaseQuestion = question.toLowerCase();
  const scoredChunks = chunks.map(chunk => ({
    chunk,
    score: calculateRelevanceScore(lowercaseQuestion, chunk.toLowerCase())
  }));
  return scoredChunks.sort((a, b) => b.score - a.score).slice(0, topK).map(item => item.chunk);
}

function calculateRelevanceScore(query: string, chunk: string): number {
  const queryTerms = query.split(/\s+/);
  const matchedTerms = queryTerms.filter(term => chunk.includes(term));
  return matchedTerms.length / queryTerms.length;
}

export async function sendQuestion(
  question: string,
  messages: Message[],
  conversationHistory: ConversationHistory[],
  ttsEnabled: boolean
): Promise<Message[]> {
  const newMessages = [...messages, { content: question, type: 'user-message' }];
  const relevantContexts = retrieveRelevantContext(question, chunkText(MANUAL_DE_CONVIVENCIA_TEXT));
  const contextString = relevantContexts.join(' ... ');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: `Contexto: ${contextString}\n\nPregunta: ${question}`,
        conversationHistory
      })
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsedChunk = JSON.parse(line.slice(6));
            if (parsedChunk.choices && parsedChunk.choices[0].delta.content) {
              const content = parsedChunk.choices[0].delta.content;
              result += content;
              newMessages[newMessages.length - 1] = { content: result, type: 'bot-message' };
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    }

    if (ttsEnabled) {
      speakText(result);
    }

    return newMessages;
  } catch (error) {
    console.error('Error processing request:', error);
    return [...newMessages, { content: `Error al procesar la solicitud: ${error.message}`, type: 'bot-message error' }];
  }
}

export function displayWelcomeMessage(setMessages: React.Dispatch<React.SetStateAction<Message[]>>) {
  const welcomeMessage = "Hola. ¡Bienvenido al Asistente del Manual de Convivencia! Estoy aquí para ayudarte a resolver dudas sobre lo escrito en el manual de convivencia de nuestra institución. ¿En qué puedo ayudarte hoy?";
  setMessages([{ content: welcomeMessage, type: 'bot-message' }]);
}

