"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Zap,
  Hash,
  Target,
  ArrowUpRight,
} from "lucide-react";
import PlinkoBoard from "./components/PlinkoBoard";
import RoundResult from "./components/RoundResult";
import { useSound } from "@/hooks/useSound";

const steps = [
  { label: "Enter Client Seed", icon: Hash },
  { label: "Choose Drop Column", icon: Target },
  { label: "Click Drop Ball", icon: Zap },
  { label: "Path generated", icon: ArrowUpRight },
  { label: "Winning Bin calculated", icon: CheckCircle2 },
  { label: "Verify fairness", icon: ShieldCheck },
];

export default function Home() {
  const [clientSeed, setClientSeed] = useState<string>("candidate-hello");
  const [betAmount, setBetAmount] = useState<number>(1);
  const [dropColumn, setDropColumn] = useState<number>(6);
  const { muted, setMuted, playPeg, playWin } = useSound();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    binIndex: number;
    pegMapHash: string;
    path: ("L" | "R")[];
  } | null>(null);
  const [showResult, setShowResult] = useState(false);

  async function handleDrop() {
    setLoading(true);
    setResult(null);
    setShowResult(false);

    try {
      const commitRes = await fetch("/api/rounds/commit", { method: "POST" });
      if (!commitRes.ok) throw new Error("Commit failed");
      const { roundId } = await commitRes.json();

      const startRes = await fetch(`/api/rounds/${roundId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSeed,
          betCents: Math.round(betAmount * 100),
          dropColumn,
        }),
      });

      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        throw new Error(err?.error || "Start failed");
      }

      const data = await startRes.json();
      setResult({
        binIndex: data.binIndex,
        pegMapHash: data.pegMapHash,
        path: data.path,
      });
    } catch (e) {
      console.error(e);
      alert((e as Error).message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col bg-[#04050a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#04050a]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/10 border border-cyan-500/20">
              <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-sm font-bold tracking-[0.18em] text-white uppercase leading-none mb-1">Plinko Lab</div>
              <div className="text-[9px] font-bold tracking-[0.22em] text-slate-500 uppercase leading-none">Provably Fair</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Live</span>
            </div>

              {/* Sound Button */}
  <button
    onClick={() => setMuted(!muted)}
    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white"
  >
    {muted ? "🔇 Muted" : "🔊 Sound"}
  </button>


            <Link
              href="/verify"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] px-4.5 py-2.5 text-xs font-semibold text-cyan-400 transition-all duration-200 hover:border-cyan-500/30 hover:shadow-[0_0_12px_rgba(34,211,238,0.08)]"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Verify Round
              <ArrowUpRight className="h-3 w-3 opacity-50" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 mx-auto max-w-7xl w-full px-6 pt-6 pb-16 space-y-6">
        {/* Hero Card */}
       <section className="premium-card px-8 py-8 md:px-10 md:py-8 rounded-[32px]">
          <div className="space-y-5  ">
            <div className="flex items-center gap-5">
              <span className="badge badge-cyan px-4 py-1.5 text-xs font-semibold tracking-wide">
                <ShieldCheck className="h-3 w-3" />
                Cryptographically Verified
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.02] text-white md:whitespace-nowrap">
              Provably Fair{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Plinko Lab
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-4xl">
              Every drop is deterministic and verifiable. Combine server seed, client seed & nonce to guarantee 100% fair outcomes.
            </p>
          </div>
        </section>

        {/* Stepper Card */}
        <section className="premium-card px-6 py-5">
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Execution Steps</h2>
            <div className="flex flex-wrap lg:flex-nowrap gap-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="step-line flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3.5"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-[9px] font-bold text-cyan-400 border border-cyan-500/20">
                      {index + 1}
                    </span>
                    <Icon className="h-3.5 w-3.5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PlinkoBoard
              rows={12}
              bins={13}
              path={result?.path ?? []}
              onAnimationComplete={() => setShowResult(true)}
              playPeg={playPeg}
              playWin={playWin}
            />
          </div>

          <div className="space-y-6">
            <div className="premium-card p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] -mx-6 md:-mx-8 px-6 md:px-8">
                <h2 className="text-xs font-bold text-white tracking-wider uppercase">Drop Configuration</h2>
                <span className="badge badge-amber">
                  <Zap className="h-2.5 w-2.5" />
                  Ready
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="premium-label">Client Seed</label>
                  <input
                    className="premium-input font-mono"
                    value={clientSeed}
                    onChange={(e) => setClientSeed(e.target.value)}
                    placeholder="Enter seed..."
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Used to generate deterministic paths. Save it to verify later.
                  </p>
                </div>

                <div>
                  <label className="premium-label">Bet Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
                    <input
                      type="number"
                      className="premium-input pl-8"
                      value={betAmount}
                      min={0}
                      step={0.01}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      placeholder="1.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="premium-label flex items-center justify-between">
                    <span>Drop Column</span>
                    <span className="text-cyan-400 font-mono">{dropColumn} / 12</span>
                  </label>
                  <input
                    type="number"
                    className="premium-input"
                    value={dropColumn}
                    min={0}
                    max={12}
                    onChange={(e) => setDropColumn(Number(e.target.value))}
                  />
                  <div className="mt-2.5 w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${(dropColumn / 12) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">Starting slot (0 to 12) from left to right.</p>
                </div>
              </div>

              <button
                onClick={handleDrop}
                disabled={loading}
                className="relative w-full h-12 rounded-xl text-sm font-bold text-white overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group mt-2"
                style={{
                  background: loading ? "rgba(34,211,238,0.15)" : "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                  boxShadow: loading ? "none" : "0 0 20px rgba(34,211,238,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Dropping Ball...</>
                  ) : (
                    <><CheckCircle2 className="h-4 w-4" />Drop Ball</>
                  )}
                </span>
              </button>
            </div>

            {result && showResult && (
              <RoundResult
                binIndex={result.binIndex}
                pegMapHash={result.pegMapHash}
                path={result.path}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.04] py-5 px-5">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">© 2024 Plinko Lab — Cryptographic fairness on every drop</p>
          <div className="flex items-center gap-4">
            <Link href="/verify" className="text-[11px] text-slate-600 hover:text-cyan-400 transition-colors">Verify Round</Link>
            <span className="text-slate-700">·</span>
            <span className="text-[11px] text-slate-600">Powered by SHA-256</span>
          </div>
        </div>
      </footer>
    </div>
  );
}