"use client";

import { useRef, useState } from "react";

export function useSound() {
  const [muted, setMuted] = useState(false);

  const pegRef = useRef<HTMLAudioElement | null>(null);
  const winRef = useRef<HTMLAudioElement | null>(null);

  const init = () => {
    if (!pegRef.current) {
      pegRef.current = new Audio("/sounds/peg.mp3");
    }

    if (!winRef.current) {
      winRef.current = new Audio("/sounds/win.mp3");
    }
  };

  const playPeg = () => {
    if (muted) return;
    init();

    if (pegRef.current) {
      pegRef.current.currentTime = 0;
      pegRef.current.play().catch(() => {});
    }
  };

  const playWin = () => {
    if (muted) return;
    init();

    if (winRef.current) {
      winRef.current.currentTime = 0;
      winRef.current.play().catch(() => {});
    }
  };

  return {
    muted,
    setMuted,
    playPeg,
    playWin,
  };
}