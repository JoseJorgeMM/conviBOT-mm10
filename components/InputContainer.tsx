import React, { useState } from 'react';
import { toggleRecording } from '../utils/speechUtils';

interface InputContainerProps {
  onSendQuestion: (question: string) => void;
  isLoading: boolean;
}

const InputContainer: React.FC<InputContainerProps> = ({ onSendQuestion, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendQuestion(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="input-container">
      <input
        type="text"
        id="user-input"
        className="input-field"
        placeholder="Escribe tu consulta sobre el manual de convivencia..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        disabled={isLoading}
      />
      <button onClick={handleSend} className="send-button" disabled={isLoading}>
        {/* SVG icon */}
      </button>
      <button id="mic-button" onClick={toggleRecording} className="mic-button">
        {/* SVG icon */}
      </button>
    </div>
  );
};

export default InputContainer;

