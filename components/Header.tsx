import React from 'react';
import { toggleDarkMode, shareChat } from '../utils/uiUtils';

interface HeaderProps {
  onResetChat: () => void;
  onToggleTts: () => void;
  ttsEnabled: boolean;
}

const Header: React.FC<HeaderProps> = ({ onResetChat, onToggleTts, ttsEnabled }) => {
  return (
    <div className="header">
      <div className="bot-header">
        <div className="bot-icon">
          {/* SVG icon */}
        </div>
        <div className="bot-title">
          <h1 className="text-xl font-bold text-gray-900">Manual de Convivencia</h1>
          <p className="text-sm text-gray-500">Tu asistente virtual para consultas</p>
        </div>
      </div>
      <div className="bot-actions">
        <a href="ENLACE_AL_MANUAL" target="_blank" className="action-button">
          {/* SVG icon */}
          Ver Manual
        </a>
        <button onClick={toggleDarkMode} className="action-button">
          {/* SVG icon */}
          Modo Oscuro
        </button>
        <button onClick={shareChat} className="action-button">
          {/* SVG icon */}
          Compartir
        </button>
        <button onClick={onResetChat} className="reset-button">
          {/* SVG icon */}
          Reiniciar Chat
        </button>
        <button onClick={onToggleTts} className={`action-button ${ttsEnabled ? 'tts-active' : ''}`}>
          {/* SVG icon */}
          {ttsEnabled ? 'Detener lectura' : 'Leer mensajes'}
        </button>
      </div>
    </div>
  );
};

export default Header;

