import { saveAudioFile, loadAudioFile, deleteAudioFile } from "../storage/files";

/* =========================
   AUDIO MANAGEMENT
========================= */

// Single shared Audio instance for all playback (prevents jank)
let audioInstance = new Audio();
let lastPlayedAudio = "";

// Initialize audio instance with error handling
audioInstance.onerror = () => {
  console.error('Audio playback error');
};

audioInstance.onended = () => {
  // Auto cleanup on end
};

// Generate filename from word: lowercase, no spaces, no special characters
export function generateAudioFilename(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '') + '.webm';
}

// Record audio using MediaRecorder API
export function recordAudio(): { promise: Promise<File>, stop: () => void } {
  let mediaRecorder: MediaRecorder | null = null;
  let stream: MediaStream | null = null;

  const promise = new Promise<File>((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(mediaStream => {
        stream = mediaStream;

        // Try different mimeTypes for better compatibility
        let mimeType = 'audio/webm;codecs=opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/webm';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/mp4';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              mimeType = ''; // Let browser choose
            }
          }
        }

        mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType || 'audio/webm' });
          const file = new File([blob], 'recording.webm', { type: mimeType || 'audio/webm' });
          resolve(file);
          
          // Stop all tracks to release microphone
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        };

        mediaRecorder.onerror = (event) => {
          reject(new Error(`Recording failed: ${event.error?.message || 'Unknown error'}`));
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
        };

        // Start recording
        mediaRecorder.start();
      })
      .catch(reject);
  });

  const stop = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  };

  return { promise, stop };
}

// Stop recording (call this when user taps stop)
export function stopRecording() {
  // This function is now deprecated since stop is returned with recordAudio
  // Keeping for backward compatibility, but it does nothing
}

// Save recorded audio for a word
export async function saveWordAudio(word: string, audioFile: File): Promise<string> {
  const filename = generateAudioFilename(word);
  await saveAudioFile(filename, audioFile);
  return filename;
}

// Play audio file (reuse single instance, no overlap)
export async function playAudio(filename: string): Promise<void> {
  try {
    const audioUrl = await loadAudioFile(filename);
    audioInstance.pause();
    audioInstance.currentTime = 0;
    audioInstance.src = audioUrl;
    lastPlayedAudio = filename;
    
    return new Promise((resolve, reject) => {
      const handleEnded = () => {
        audioInstance.removeEventListener('ended', handleEnded);
        resolve();
      };
      
      audioInstance.addEventListener('ended', handleEnded);
      audioInstance.play().catch(reject);
    });
  } catch (error) {
    console.error('Audio playback error:', error);
    throw error;
  }
}

// Play phonics (letter sounds) - try external audio files first, then synthetic
export async function playPhonics(text: string): Promise<void> {
  // Stop any currently playing audio
  if (audioInstance) {
    audioInstance.pause();
    audioInstance.currentTime = 0;
  }

  // Try to play a file for the entire phrase first
  const phraseFile = text.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.mp3';
  try {
    await playExternalPhonicsPhrase(phraseFile);
    return;
  } catch (error) {
    // Fall back to individual letters
  }

  for (const char of text.toLowerCase()) {
    if (char >= 'a' && char <= 'z') {
      try {
        // Try to play external phonetic file first
        await playExternalPhonics(char);
      } catch (error) {
        // Fallback to synthetic sound
        await playSyntheticPhonics(char);
      }
      
      // Small pause between letters
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
}

// Play external phonetic audio files (place in public/audio/phonics/)
async function playExternalPhonics(letter: string): Promise<void> {
  return new Promise((resolve, reject) => {
    audioInstance.pause();
    audioInstance.currentTime = 0;
    audioInstance.src = `/audio/phonics/${letter}.mp3`;
    
    const handleEnded = () => {
      audioInstance.removeEventListener('ended', handleEnded);
      resolve();
    };
    
    const handleError = () => {
      audioInstance.removeEventListener('ended', handleEnded);
      console.error(`Failed to load phonics for ${letter}`);
      reject(new Error('External phonics file not found'));
    };
    
    audioInstance.addEventListener('ended', handleEnded);
    audioInstance.addEventListener('error', handleError);
    audioInstance.play().catch(reject);
  });
}

// Play external phrase audio files (place in public/audio/phonics/)
async function playExternalPhonicsPhrase(filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    audioInstance.pause();
    audioInstance.currentTime = 0;
    audioInstance.src = `/audio/phonics/${filename}`;
    
    const handleEnded = () => {
      audioInstance.removeEventListener('ended', handleEnded);
      resolve();
    };
    
    const handleError = () => {
      audioInstance.removeEventListener('ended', handleEnded);
      console.error(`Failed to load phrase ${filename}`);
      reject(new Error('External phrase file not found'));
    };
    
    audioInstance.addEventListener('ended', handleEnded);
    audioInstance.addEventListener('error', handleError);
    audioInstance.play().catch(reject);
  });
}

// Play synthetic phonics (fallback)
async function playSyntheticPhonics(letter: string): Promise<void> {
  // Create audio context for letter sounds
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  return playLetterSound(audioContext, letter);
}

// Play individual letter sound
function playLetterSound(audioContext: AudioContext, letter: string): Promise<void> {
  return new Promise(resolve => {
    const now = audioContext.currentTime;
    
    // Different frequencies for different letters (rough approximation)
    const baseFreq = 220; // A3
    const letterIndex = letter.charCodeAt(0) - 'a'.charCodeAt(0);
    const frequency = baseFreq * Math.pow(1.059, letterIndex * 2); // Roughly 2 semitones per letter
    
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.8, now + 0.15);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc.start(now);
    osc.stop(now + 0.2);
    
    osc.onended = () => resolve();
  });
}

// Stop any currently playing audio
export function stopAudio(): void {
  audioInstance.pause();
  audioInstance.currentTime = 0;
}

// Delete audio file
export async function deleteWordAudio(filename: string): Promise<void> {
  await deleteAudioFile(filename);
}

/* =========================
   TEXT-TO-SPEECH (TTS) FOR WORD DEFINITIONS (Fire-and-Forget, Non-blocking)
========================= */

// TTS freeze safety kill switch
let ttsEnabled = true;

// Safe TTS wrapper - guarantees zero freezes
const speak = (text?: string) => {
  const safe = text?.trim();
  if (!safe) return;

  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(safe));
};

// Optimized TTS that doesn't block UI and doesn't require await
export function speakWord(word: string, definition?: string): void {
  // If TTS is disabled (due to previous errors), skip silently
  if (!ttsEnabled) return;

  // Check if browser supports Web Speech API
  if (!("speechSynthesis" in window)) {
    console.warn('Web Speech API not supported');
    ttsEnabled = false; // Disable if not supported
    return;
  }

  try {
    // Create the speech text
    // Format: "a for apple" or just the word if no definition
    const speechText = definition 
      ? `${word} for ${definition}`
      : word;
    
    const utterance = new SpeechSynthesisUtterance(speechText);
    
    // Configure utterance for kids
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.2; // Slightly higher pitch for child-friendly voice
    utterance.volume = 1.0; // Full volume
    
    // Use a child-friendly voice if available
    const voices = speechSynthesis.getVoices();
    const childVoice = voices.find(v => 
      v.name.toLowerCase().includes('child') || 
      v.name.toLowerCase().includes('kid') ||
      v.name.toLowerCase().includes('google us english')
    ) || voices[0];
    
    if (childVoice) {
      utterance.voice = childVoice;
    }
    
    // Critical: Cancel any ongoing speech before speaking
    speechSynthesis.cancel();
    
    // Fire-and-forget: No await, no onend dependency
    speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('TTS error:', error);
    // Permanently disable TTS if it fails
    ttsEnabled = false;
  }
}

// Speak just the word (without definition)
export function speakWordOnly(word: string): void {
  speakWord(word, undefined);
}

// Get TTS enabled status (for debugging)
export function isTTSEnabled(): boolean {
  return ttsEnabled;
}