import { useState, useRef, useEffect } from "react";
import { getCelebrationEnabled } from "@/storage/settings";

export interface Balloon {
  id: number;
  x: number;
  popped: boolean;
}

export interface Star {
  id: number;
  x: number;
  y: number;
}

export interface Confetti {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const useCelebration = () => {
  const [showBalloons, setShowBalloons] = useState(false);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const celebrationCleanupTimerRef = useRef<number | null>(null);

  const playClap = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;
      
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // fail silently
    }
  };

  const runCelebration = () => {
    console.log("CELEBRATION START");
    if (celebrationCleanupTimerRef.current) {
      clearTimeout(celebrationCleanupTimerRef.current);
      celebrationCleanupTimerRef.current = null;
    }

    // Play celebratory claps
    playClap();
    setTimeout(() => playClap(), 200);
    setTimeout(() => playClap(), 400);

    // Show balloons celebration with 4 balloons
    setShowBalloons(true);
    setBalloons([
      { id: 1, x: 15 + Math.random() * 15, popped: false },
      { id: 2, x: 35 + Math.random() * 15, popped: false },
      { id: 3, x: 55 + Math.random() * 15, popped: false },
      { id: 4, x: 75 + Math.random() * 15, popped: false }
    ]);

    // Create confetti burst
    const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 3
    }));
    setConfetti(confettiPieces);

    // Remove confetti after animation
    setTimeout(() => {
      setConfetti([]);
    }, 6000);

    // Auto-cleanup celebration UI after 6 seconds if balloons aren't all popped
    celebrationCleanupTimerRef.current = window.setTimeout(() => {
      console.log("CELEBRATION AUTO-CLEANUP (6s timeout)");
      setShowBalloons(false);
      setBalloons([]);
      setStars([]);
      celebrationCleanupTimerRef.current = null;
    }, 6000);
  };

  const handleBalloonPop = (balloonId: number, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    
    console.log("BALLOON POPPED:", balloonId);
    
    // Create celebration stars
    const newStars = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }));
    setStars(prev => [...prev, ...newStars]);
    
    // Remove stars after animation
    setTimeout(() => {
      setStars(prev => prev.filter(s => !newStars.find(ns => ns.id === s.id)));
    }, 1000);
    
    // Mark balloon as popped
    setBalloons(prev => {
      const updated = prev.map(b =>
        b.id === balloonId ? { ...b, popped: true } : b
      );

      const allPopped = updated.every(b => b.popped);
      
      if (allPopped) {
        console.log("ALL BALLOONS POPPED - Cleanup early");
        if (celebrationCleanupTimerRef.current) {
          clearTimeout(celebrationCleanupTimerRef.current);
          celebrationCleanupTimerRef.current = null;
        }

        setTimeout(() => {
          console.log("Clearing celebration UI after all balloons popped");
          setShowBalloons(false);
          setStars([]);
          setBalloons([]);
        }, 1200);
      }

      return updated;
    });
  };

  const clearCelebration = () => {
    if (celebrationCleanupTimerRef.current) {
      clearTimeout(celebrationCleanupTimerRef.current);
      celebrationCleanupTimerRef.current = null;
    }
    setShowBalloons(false);
    setBalloons([]);
    setStars([]);
    setConfetti([]);
  };

  const triggerCelebration = () => {
    if (getCelebrationEnabled()) {
      runCelebration();
    }
  };

  return {
    showBalloons,
    balloons,
    stars,
    confetti,
    handleBalloonPop,
    clearCelebration,
    triggerCelebration,
  };
};
