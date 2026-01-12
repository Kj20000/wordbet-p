import { useEffect, useRef, useState } from "react";
import { playPhonics, stopAudio } from "@/lib/audio";
import { hapticTap } from "@/lib/haptics";
import { Word } from "./useWords";

let idleTimer: number | null = null;
let audioContext: AudioContext | null = null;

export const useAudioFlow = (currentWord: Word | null, showBalloons: boolean) => {
  const [currentInput, setCurrentInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [highlightedKey, setHighlightedKey] = useState("");
  const [wordCompleted, setWordCompleted] = useState(false);

  // Resume audio context on first user interaction
  useEffect(() => {
    const resumeAudio = async () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
    };

    const handleInteraction = () => {
      resumeAudio();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Warm up TTS ONCE on mount
  useEffect(() => {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.getVoices();
      } catch (error) {
        console.error('TTS warmup error:', error);
      }
    }
  }, []);

  const hardStopAudio = () => {
    stopAudio();
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  };

  // Reset word when current word changes
  useEffect(() => {
    if (!currentWord) return;
    
    console.log("RESET WORD effect for:", currentWord.word);
    setCurrentInput("");
    setWordCompleted(false);
    
    const first = currentWord.word[0];
    setSuggestion(first.toUpperCase());
    setHighlightedKey(first.toLowerCase());

    // Clear any existing idle timer
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }

    // Speak first letter using phonics
    const playFirstLetterPhonics = async () => {
      try {
        await playPhonics(first);
      } catch (error) {
        console.error('Phonics error:', error);
      }
    };

    playFirstLetterPhonics();

    // Start idle reminder timer
    idleTimer = window.setTimeout(() => {
      if (currentInput === "") {
        playFirstLetterPhonics();
        
        idleTimer = window.setTimeout(() => {
          if (currentInput === "") {
            playFirstLetterPhonics();
          }
        }, 3000);
      }
    }, 3000);

    return () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
    };
  }, [currentWord?.id]);

  const handleInputChange = (value: string) => {
    if (!currentWord) return;

    const lower = value.toLowerCase();
    if (!currentWord.word.startsWith(lower)) return;

    setCurrentInput(lower);

    // Reset idle timer
    if (idleTimer) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }

    if (lower.length < currentWord.word.length) {
      const next = currentWord.word[lower.length];
      setSuggestion(next.toUpperCase());
      setHighlightedKey(next.toLowerCase());
      
      const playNextLetter = async () => {
        try {
          await playPhonics(next);
        } catch (error) {
          console.error('Phonics playback error:', error);
        }
      };

      setTimeout(() => {
        hardStopAudio();
        playNextLetter();
        
        idleTimer = window.setTimeout(() => {
          playPhonics(next).catch(console.error);
        }, 2500);
      }, 400);
    } else {
      // Word completed
      setSuggestion("");
      setHighlightedKey("");
      setWordCompleted(true);
      stopAudio();
      
      console.log("WORD COMPLETE", currentWord.word);
      hapticTap(50);
    }
  };

  const resetWordState = () => {
    setWordCompleted(false);
    setCurrentInput("");
  };

  return {
    currentInput,
    suggestion,
    highlightedKey,
    wordCompleted,
    handleInputChange,
    hardStopAudio,
    resetWordState,
  };
};
