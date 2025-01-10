export function toggleDarkMode() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  const themeButton = document.querySelector(".action-button[onclick='toggleDarkMode()']");
  if (themeButton) {
    themeButton.textContent = newTheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
  }
}

export function shareChat() {
  const chatContainer = document.getElementById('chat-container');
  if (!chatContainer) {
    console.error('Chat container not found');
    return;
  }

  const messages = Array.from(chatContainer.getElementsByClassName('message')).map(msg => {
    const contentEl = msg.querySelector('.message-content');
    if (!contentEl) {
      return '';
    }
    const content = contentEl.textContent;
    const isUser = msg.classList.contains('user-message');
    return `${isUser ? 'Usuario' : 'ConviBot'}: ${content}`;
  }).filter(msg => msg).join('\n\n');

  if (navigator.share) {
    navigator.share({
      title: 'Chat del Manual de Convivencia',
      text: messages
    }).catch(err => {
      console.error('Error sharing:', err);
      fallbackToClipboard(messages);
    });
  } else {
    fallbackToClipboard(messages);
  }
}

function fallbackToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Chat copiado al portapapeles');
  }).catch(err => {
    console.error('Error copying to clipboard:', err);
    alert('No se pudo copiar el chat al portapapeles');
  });
}

