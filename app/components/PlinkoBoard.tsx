"use client";

import React from "react";

type Props = {
  rows: number;
  bins: number;
  path: ("L" | "R")[];
};

export default function PlinkoBoard({ rows, bins, path }: Props) {
  const positions: number[] = [];
  const readablePath = path.length > 0 ? path.join(" → ") : "Waiting for drop";
  let pos = 0;

  for (let row = 0; row < rows; row++) {
    positions.push(pos);

    if (path[row] === "R") {
      pos++;
    }
  }

  return (
    <div className="w-full">
      <div className="premium-card p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 mb-8 flex flex-col gap-4 border-b border-[#1e2230] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Plinko Board
            </h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              {rows} rows · {bins} bins
            </p>
          </div>
          <div className="min-w-0 rounded-xl bg-[#0d0f17] border border-[#1e2230] px-4 py-2.5 sm:max-w-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Active Ball Path</p>
            <p className="break-words font-mono text-xs text-cyan-400 font-semibold tracking-wide">
              {readablePath}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="relative z-10 mb-8 flex flex-wrap items-center gap-4 rounded-xl bg-[#0d0f17] border border-[#1e2230] px-4 py-3 text-xs text-slate-400">
          <span className="font-bold text-white uppercase tracking-wider text-[10px]">Legend</span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            Left movement
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Right movement
          </span>
        </div>

        {/* Peg Matrix */}
        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-5 pb-4">
          {Array.from({ length: rows }).map((_, row) => (
            <div
              key={row}
              className="relative w-full max-w-3xl"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${row + 1}, minmax(0, 1fr))`,
                gap: `${Math.max(6, 24 - row * 1.25)}px`,
              }}
            >
              {Array.from({ length: row + 1 }).map((_, peg) => {
                const isPegInPath = positions[row] === peg && path.length > row;

                return (
                  <div key={peg} className="flex justify-center py-1">
                    <div
                      className={`rounded-full transition-all duration-300 ${
                        isPegInPath
                          ? "h-3.5 w-3.5 bg-gradient-to-br from-amber-400 to-orange-500 shadow-md sm:h-4 sm:w-4"
                          : "h-3 w-3 bg-[#272d40] sm:h-3.5 sm:w-3.5"
                      }`}
                    />
                  </div>
                );
              })}

              {path.length > row && (
                <div
                  style={{
                    gridColumnStart: positions[row] + 1,
                    gridRowStart: 1,
                  }}
                  className="pointer-events-none flex justify-center"
                >
                  <div
                    className="relative -mt-5 animate-bounce sm:-mt-6"
                    style={{ animationDuration: "1s" }}
                  >
                    <div className="relative h-5 w-5 rounded-full bg-cyan-400 shadow-lg ring-2 ring-cyan-200/50 sm:h-5.5 sm:w-5.5">
                      <div className="absolute inset-1 rounded-full bg-white/40" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bins */}
        <div className="relative z-10 mt-8">
          <div
            className="mx-auto grid max-w-3xl gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${bins}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: bins }).map((_, index) => {
              const isBallBin =
                path.length === rows && index === positions[rows - 1];

              return (
                <div key={index} className="flex min-w-0 flex-col items-center">
                  <div
                    className={`flex w-full items-center justify-center rounded-t-lg px-1 py-2 text-xs font-bold transition-all duration-300 ${
                      isBallBin
                        ? "bg-gradient-to-b from-cyan-500 to-blue-600 text-white shadow-md"
                        : "border border-[#1e2230] bg-[#0d0f17] text-slate-400"
                    }`}
                  >
                    {index}
                  </div>
                  <div
                    className={`h-10 w-full rounded-b-lg border border-t-0 transition-all duration-300 ${
                      isBallBin
                        ? "border-cyan-500/50 bg-[#06b6d4]/10 shadow-[inset_0_1px_6px_rgba(6,182,212,0.2)]"
                        : "border-[#1e2230] bg-[#0d0f17]"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
