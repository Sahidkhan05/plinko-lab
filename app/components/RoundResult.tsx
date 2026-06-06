"use client";

import React from "react";
import { Fingerprint, Route, Trophy, Zap } from "lucide-react";

type Props = {
  binIndex: number;
  pegMapHash: string;
  path: ("L" | "R")[];
};

export default function RoundResult({ binIndex, pegMapHash, path }: Props) {
  const readablePath = path.length > 0 ? path.join(" → ") : "No path yet";

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-white/7 p-5 shadow-2xl shadow-purple-950/20 backdrop-blur-2xl sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-2.5">
          <Trophy className="h-5 w-5 text-amber-300" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Round Result</h3>
          <p className="text-sm text-slate-400">Path, bin, and proof details</p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-200">
          <Route className="h-4 w-4" />
          Ball Path
        </div>
        <p className="mb-3 text-xs leading-5 text-slate-400">
          Each step shows whether the ball moved left or right through the peg
          rows.
        </p>
        <p className="break-words font-mono text-sm text-cyan-100">
          {readablePath}
        </p>
      </div>

      <div className="mb-4 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-sky-500/10 to-fuchsia-500/10 p-5 shadow-[0_0_28px_rgba(56,189,248,0.12)]">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-200">
          <Zap className="h-4 w-4" />
          Winning Bin
        </div>
        <p className="mb-2 text-xs leading-5 text-slate-400">
          The final bin is calculated from the complete generated path.
        </p>
        <div className="bg-gradient-to-r from-cyan-200 via-sky-200 to-fuchsia-200 bg-clip-text text-5xl font-semibold tracking-tight text-transparent">
          {binIndex}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          <Fingerprint className="h-4 w-4" />
          Peg Map Hash
        </div>
        <p className="mb-3 text-xs leading-5 text-slate-400">
          This hash identifies the peg layout used for the round.
        </p>
        <div className="break-all font-mono text-xs leading-relaxed text-cyan-100/90">
          {pegMapHash}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-50/85">
        The server seed, client seed, and nonce generate a deterministic path.
        The same inputs always produce the same result.
      </div>
    </div>
  );
}
