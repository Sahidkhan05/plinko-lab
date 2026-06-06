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
    <div className="premium-card p-6 space-y-6">
      <div className="flex items-center gap-3.5 border-b border-[#1e2230] pb-4">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5">
          <Trophy className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">Round Result</h3>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Path, bin, and proof details</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-[#0d0f17] border border-[#1e2230] p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
            <Route className="h-4 w-4" />
            Ball Path
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Deterministic bounce route sequence.
          </p>
          <p className="break-words font-mono text-xs text-cyan-300 font-semibold bg-[#12141c] border border-[#1e2230] p-3 rounded-lg">
            {readablePath}
          </p>
        </div>

        <div className="rounded-xl bg-[#0d0f17] border border-[#1e2230] p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500 mb-1.5">
            <Zap className="h-4 w-4" />
            Winning Bin
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Final bin slot index.
          </p>
          <div className="text-4xl font-extrabold text-white bg-[#12141c] border border-[#1e2230] py-3 rounded-lg text-center select-all">
            {binIndex}
          </div>
        </div>

        <div className="rounded-xl bg-[#0d0f17] border border-[#1e2230] p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            <Fingerprint className="h-4 w-4" />
            Peg Map Hash
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Cryptographic layout check verification string.
          </p>
          <div className="break-all font-mono text-[11px] text-slate-300 font-semibold bg-[#12141c] border border-[#1e2230] p-3 rounded-lg select-all">
            {pegMapHash}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs font-medium leading-relaxed text-emerald-400">
        Deterministic outcome. Server seed, client seed, and nonce inputs always reproduce this exact sequence.
      </div>
    </div>
  );
}
