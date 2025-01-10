let recognition: SpeechRecognition | null = null;
let isRecording = false;
let spanishVoice: SpeechSynthesisVoice | null = null;

export function initTextToSpeech() {
  speechSynthesis.onvoiceschanged = () => {
    const voices = speechSynthesis.getVoices();
    spanishVoice = voices.find(voice => voice.lang.includes('es')) || voices[0];
  };
}

export function toggleRecording() {
  if (!recognition) {
    initializeSpeechRecognition();
  }

  if (!isRecording) {
    try {
      recognition!.start();
      isRecording = true;
      document.getElementById('mic-button')?.classList.add('recording');
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  } else {
    stopRecording();
  }
}

function initializeSpeechRecognition() {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-ES';
    recognition.onresult = function (event) {
      const userInput = document.getElementById('user-input') as HTMLInputElement;
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        userInput.value = finalTranscript;
      }
    };
    recognition.onerror = function (event) {
      console.error('Speech recognition error:', event.error);
      stopRecording();
    };
    recognition.onend = function () {
      stopRecording();
    };
  } else {
    console.error('Speech recognition not supported');
  }
}

function stopRecording() {
  if (recognition) {
    recognition.stop();
  }
  isRecording = false;
  document.getElementById('mic-button')?.classList.remove('recording');
}

export function speakText(text: string) {
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = spanishVoice;
  utterance.lang = 'es-ES';
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

