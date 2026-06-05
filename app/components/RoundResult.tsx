"use client";

import React from "react";

interface RoundResultProps {
  binIndex: number;
  pegMapHash: string;
  path: ("L" | "R")[];
}

export default function RoundResult({ binIndex, pegMapHash, path }: RoundResultProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mt-6 p-4 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-900">Round Result</h3>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="p-3 bg-zinc-50 rounded-md">
          <div className="text-sm text-zinc-500">Bin Index</div>
          <div className="text-2xl font-bold">{binIndex}</div>
        </div>
        <div className="p-3 bg-zinc-50 rounded-md col-span-2">
          <div className="text-sm text-zinc-500">Peg Map Hash</div>
          <div className="break-words text-sm font-mono text-zinc-700">{pegMapHash}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-zinc-500">Path</div>
        <div className="mt-2 flex flex-wrap gap-1">
          {path.map((p, i) => (
            <span key={i} className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs">
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
