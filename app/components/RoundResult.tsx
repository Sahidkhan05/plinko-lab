"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Fingerprint, Route, Trophy, Zap, Copy, Check, ArrowUpRight } from "lucide-react";

type Props = {
  binIndex: number;
  pegMapHash: string;
  path: ("L" | "R")[];
  roundId: string;
  serverSeed: string;
  clientSeed: string;
  nonce: string;
  dropColumn: number;
};

export default function RoundResult({
  binIndex,
  pegMapHash,
  path,
  roundId,
  serverSeed,
  clientSeed,
  nonce,
  dropColumn,
}: Props) {
  const [copied, setCopied] = useState(false);
  const readablePath = path.length > 0 ? path.join(" → ") : "No path yet";

  async function copyHash() {
    await navigator.clipboard.writeText(pegMapHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const verifyLink = `/verify?roundId=${encodeURIComponent(roundId)}&serverSeed=${encodeURIComponent(
    serverSeed
  )}&clientSeed=${encodeURIComponent(clientSeed)}&nonce=${encodeURIComponent(nonce)}&dropColumn=${dropColumn}`;

  return (
    <div className="premium-card p-5 space-y-4 card-glow-cyan">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.05]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Trophy className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">Round Result</h3>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
            Path · Bin · Proof
          </p>
        </div>
        <div className="ml-auto">
          <span className="badge badge-green">
            <Check className="h-2.5 w-2.5" />
            Verified
          </span>
        </div>
      </div>

      {/* Round Details Summary */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Round Details</p>
        <p className="text-[11px] text-slate-600">
          These values were generated for this round and can be independently verified.
        </p>
        <div className="grid grid-cols-1 gap-2 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Round ID:</span>
            <span className="font-mono text-slate-400 truncate">{roundId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Server Seed:</span>
            <span className="font-mono text-slate-400 truncate">{serverSeed.slice(0, 16)}...</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Client Seed:</span>
            <span className="font-mono text-slate-400 truncate">{clientSeed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Nonce:</span>
            <span className="font-mono text-slate-400">{nonce}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Drop Column:</span>
            <span className="font-mono text-slate-400">{dropColumn} / 12</span>
          </div>
        </div>
      </div>

      {/* Verify Button */}
      <Link
        href={verifyLink}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-600/5 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-all duration-200 hover:shadow-[0_0_12px_rgba(34,211,238,0.15)]"
      >
        <Zap className="h-3 w-3" />
        Verify This Round
        <ArrowUpRight className="h-2.5 w-2.5 opacity-50" />
      </Link>

      {/* Winning Bin hero */}
      <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/5 border border-cyan-500/15 p-5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-500/70 mb-2 flex items-center justify-center gap-1.5">
          <Zap className="h-3 w-3" />
          Winning Bin
        </p>
        <div className="text-6xl font-black text-white number-glow select-all">
          {binIndex}
        </div>
        <p className="text-[11px] text-slate-600 mt-2">Final landing slot index</p>
      </div>

      {/* Ball Path */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-400 mb-3">
          <Route className="h-3.5 w-3.5" />
          Ball Path
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {path.map((step, i) => (
            <span
              key={i}
              className={`inline-flex items-center justify-center h-6 w-6 rounded-lg text-[10px] font-bold font-mono ${
                step === "L"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              {step}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-slate-700 mt-2 font-mono leading-relaxed break-words">
          {readablePath}
        </p>
      </div>

      {/* Peg Map Hash */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
            <Fingerprint className="h-3.5 w-3.5" />
            Peg Map Hash
          </div>
          <button
            onClick={copyHash}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-[10px] font-semibold text-slate-400 hover:text-white transition-all duration-200"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="break-all font-mono text-[11px] text-slate-400 bg-white/[0.02] border border-white/[0.04] p-3 rounded-lg select-all leading-relaxed">
          {pegMapHash}
        </div>
      </div>

      {/* Verification note */}
      <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] p-3.5 flex items-start gap-2.5">
        <div className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-400">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.707 5.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L7 7.586l3.293-3.293a1 1 0 011.414 1.414z" />
          </svg>
        </div>
        <p className="text-[11px] font-medium leading-relaxed text-emerald-400/80">
          Deterministic outcome. Server seed + client seed + nonce always reproduce this exact sequence.
        </p>
      </div>
    </div>
  );
}