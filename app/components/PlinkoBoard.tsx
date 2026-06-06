"use client";

import React, { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";

type Props = {
  rows: number;
  bins: number;
  path: ("L" | "R")[];
  onAnimationComplete?: () => void;
  playPeg?: () => void;
  playWin?: () => void;
};

export default function PlinkoBoard({ rows, bins, path, onAnimationComplete, playPeg, playWin }: Props) {
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const timeoutRef = useRef<number | null>(null);
  const positions: number[] = [];
  let pos = 0;

  for (let row = 0; row < rows; row++) {
    positions.push(pos);
    if (path[row] === "R") pos++;
  }

  const winningBin = path.length === rows ? pos : null;
  const activeRow = currentStep >= 0 && currentStep < rows ? currentStep : null;
  const activePeg = activeRow !== null ? positions[activeRow] : null;
  const isBinStep = currentStep === rows;

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (path.length !== rows) {
      setCurrentStep(-1);
      return;
    }

    setCurrentStep(0);
    if (playPeg) {
      playPeg();
    }

    const animateStep = (step: number) => {
      setCurrentStep(step);

      if (step < rows) {
        if (playPeg) {
          playPeg();
        }

        timeoutRef.current = window.setTimeout(() => {
          animateStep(step + 1);
        }, 150);
      } else {
        if (playWin) {
          playWin();
        }

        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }
    };

    timeoutRef.current = window.setTimeout(() => {
      animateStep(1);
    }, 150);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [path.length, path.join(","), rows, onAnimationComplete, playPeg, playWin]);

  return (
    <div className="w-full">
      <div className="premium-card p-6 md:p-8 relative overflow-hidden">
        {/* Glow behind board */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(34,211,238,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Header */}
        <div className="relative z-10 mb-8 flex flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold tracking-tight text-white">Plinko Board</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 mt-0.5">
                {rows} rows · {bins} bins
              </p>
            </div>
            {path.length > 0 && (
              <span className="badge badge-cyan ml-4">Live</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold text-white tracking-wider uppercase">Drop Configuration</h2>
            <span className="badge badge-amber ml-2">
              <Zap className="h-2.5 w-2.5" />
              Ready
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="relative z-10 mb-8 flex items-center gap-5 text-xs text-slate-500 px-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-600">Legend</span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.7)]" />
            Left
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]" />
            Right
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-slate-600" />
            Idle
          </span>
        </div>

        {/* Peg Grid */}
        <div className="relative z-10 flex flex-col items-center gap-2 pb-6 mx-auto max-w-2xl">
          {Array.from({ length: rows }).map((_, row) => (
            <div
              key={row}
              className="relative w-full h-7"
            >
              {Array.from({ length: row + 1 }).map((_, peg) => {
                const leftPercent = ((peg + (12 - row) / 2 + 0.5) / 13) * 100;
                const isActive = activeRow === row && activePeg === peg;

                return (
                  <div
                    key={peg}
                    className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2"
                    style={{ left: `${leftPercent}%` }}
                  >
                    <div
                      className={`rounded-full transition-all duration-300 ${isActive
                        ? "h-3.5 w-3.5 bg-cyan-400 border border-cyan-300/40 shadow-[0_0_10px_rgba(34,211,238,0.55)] sm:h-4 sm:w-4"
                        : "h-2.5 w-2.5 bg-slate-700/60 hover:bg-slate-600/80 sm:h-3 sm:w-3"
                      }`}
                    />
                  </div>
                );
              })}

              {activeRow === row && (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 pointer-events-none"
                  style={{
                    left: `${((positions[row] + (12 - row) / 2 + 0.5) / 13) * 100}%`,
                  }}
                >
                  <div className="relative h-4 w-4 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.9)] ring-2 ring-cyan-300/55">
                    <div className="absolute top-1 left-1.5 h-1.5 w-1 rounded-full bg-white/70 rotate-12" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bins */}
        <div className="relative z-10 mt-6 border-t border-white/[0.04] pt-6 mx-auto max-w-2xl">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${bins}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: bins }).map((_, index) => {
              const isWinner = winningBin === index && isBinStep;
              return (
                <div key={index} className="flex flex-col items-center relative">
                  <div
                    className={`flex w-full items-center justify-center rounded-t-lg py-2 text-[10px] font-bold transition-all duration-500 ${isWinner
                      ? "bg-gradient-to-b from-cyan-400 to-blue-500 text-white bin-winning shadow-[0_-4px_12px_rgba(34,211,238,0.4)]"
                      : "bg-white/[0.03] border border-white/[0.06] text-slate-600"
                      }`}
                    style={{ height: "30px" }}
                  >
                    {index}
                  </div>
                  <div
                    className={`h-10 w-full rounded-b-lg transition-all duration-500 ${isWinner
                      ? "bg-cyan-500/10 border border-cyan-500/30 border-t-0"
                      : "bg-white/[0.02] border border-white/[0.04] border-t-0"
                      }`}
                  />
                  {isWinner && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-5">
                      <div className="h-4 w-4 rounded-full bg-gradient-to-br from-cyan-300 to-cyan-500 shadow-[0_0_12px_rgba(34,211,238,0.9)] ring-2 ring-cyan-300/55" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bin labels */}
          <div
            className="mt-2.5 grid gap-1"
            style={{ gridTemplateColumns: `repeat(${bins}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: bins }).map((_, index) => (
              <div key={index} className="flex justify-center">
                <span className={`text-[9px] font-mono font-semibold ${winningBin === index && isBinStep ? "text-cyan-400 font-bold" : "text-slate-700"}`}>
                  {index}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}