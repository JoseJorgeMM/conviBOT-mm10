import React, { forwardRef } from 'react';
import { Message } from '../types';

interface ChatContainerProps {
  messages: Message[];
}

const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(({ messages }, ref) => {
  return (
    <div id="chat-container" className="chat-container" ref={ref}>
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.type}`}>
          <div className="message-icon">
            {/* SVG icon */}
          </div>
          <div className="message-content">{message.content}</div>
        </div>
      ))}
    </div>
  );
});

export default ChatContainer;

