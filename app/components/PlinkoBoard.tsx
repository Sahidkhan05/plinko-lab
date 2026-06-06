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
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/7 p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(192,132,252,0.14),_transparent_30%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

        <div className="relative z-10 mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Plinko Board
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {rows} rows · {bins} bins
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border border-cyan-400/20 bg-slate-950/45 px-4 py-2 shadow-inner shadow-black/20 sm:max-w-md">
            <p className="text-xs font-medium text-slate-400">Ball Path</p>
            <p className="break-words font-mono text-sm text-cyan-100">
              {readablePath}
            </p>
          </div>
        </div>

        <div className="relative z-10 mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-3 text-sm text-slate-300">
          <span className="font-medium text-white">Legend</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.75)]" />
            Left movement
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.75)]" />
            Right movement
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-5">
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
                      className={`rounded-full ring-1 ring-inset transition-all duration-500 ${
                        isPegInPath
                          ? "h-4 w-4 bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 ring-amber-200/60 shadow-[0_0_18px_rgba(251,191,36,0.9)] sm:h-5 sm:w-5"
                          : "h-3 w-3 bg-gradient-to-br from-slate-500 to-slate-700 ring-white/10 shadow-[0_0_12px_rgba(148,163,184,0.25)] sm:h-4 sm:w-4"
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
                    className="relative -mt-6 animate-bounce sm:-mt-7"
                    style={{ animationDuration: "1s" }}
                  >
                    <div className="relative h-5 w-5 rounded-full bg-gradient-to-br from-cyan-200 via-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(34,211,238,0.65)] ring-2 ring-cyan-100/40 sm:h-6 sm:w-6">
                      <div className="absolute inset-1 rounded-full bg-white/30" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-8 sm:mt-10">
          <div
            className="mx-auto grid max-w-3xl gap-2 sm:gap-2.5"
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
                    className={`flex w-full items-center justify-center rounded-t-xl px-1 py-2 text-xs font-semibold transition-all duration-500 sm:text-sm ${
                      isBallBin
                        ? "bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 text-white shadow-[0_0_24px_rgba(56,189,248,0.45)]"
                        : "border border-white/10 bg-white/5 text-slate-300"
                    }`}
                  >
                    {index}
                  </div>
                  <div
                    className={`h-10 w-full rounded-b-xl border border-t-0 border-white/10 transition-all duration-500 sm:h-12 ${
                      isBallBin
                        ? "bg-gradient-to-b from-cyan-500/30 to-fuchsia-500/10 shadow-inner shadow-cyan-400/20"
                        : "bg-[linear-gradient(180deg,rgba(15,23,42,0.85),rgba(2,6,23,0.92))]"
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
