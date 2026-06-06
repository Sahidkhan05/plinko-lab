"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import PlinkoBoard from "./components/PlinkoBoard";
import RoundResult from "./components/RoundResult";

const steps = [
  "Enter Client Seed",
  "Choose Drop Column",
  "Click Drop Ball",
  "Path is generated",
  "Winning Bin is calculated",
  "Verify fairness",
];

export default function Home() {
  const [clientSeed, setClientSeed] = useState<string>("candidate-hello");
  const [betAmount, setBetAmount] = useState<number>(1);
  const [dropColumn, setDropColumn] = useState<number>(6);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    binIndex: number;
    pegMapHash: string;
    path: ("L" | "R")[];
  } | null>(null);

  async function handleDrop() {
    setLoading(true);
    setResult(null);

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
    <div className="min-h-screen text-slate-100 flex flex-col bg-[#090a0f]">
      {/* Premiumsticky header */}
      <header className="sticky top-0 z-50 border-b border-[#1e2230] bg-[#0c0d14]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-[0.2em] text-white uppercase">
              Plinko Lab
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Provably Fair Dashboard
            </span>
          </div>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-xl border border-[#272d40] bg-[#12141c] hover:bg-[#1b1f2b] px-4 py-2.5 text-xs font-semibold text-cyan-400 transition"
          >
            <Sparkles className="h-4 w-4" />
            Verify Round
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8 space-y-8">
        {/* Intro Hero with stepper */}
        <section className="premium-card p-6 flex flex-col gap-6 md:flex-row md:items-center justify-between">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Modern Plinko Lab
            </h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Verify every drop instantly. Our system uses cryptographic seed hashing to guarantee 100% fair outcomes.
            </p>
          </div>

          {/* Stepper Flow */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-2 bg-[#0d0f17] border border-[#1e2230] rounded-xl px-3.5 py-2 text-xs text-slate-300"
              >
                <span className="font-bold text-cyan-400 text-xs">{index + 1}</span>
                <span className="font-medium text-slate-400">{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Plinko board - takes up 2 cols on large screens */}
          <div className="lg:col-span-2">
            <PlinkoBoard rows={12} bins={13} path={result?.path ?? []} />
          </div>

          {/* Configuration & Controls */}
          <div className="space-y-6">
            <div className="premium-card p-6 space-y-6">
              <h2 className="text-base font-bold text-white tracking-wide border-b border-[#1e2230] pb-3">
                Drop Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="premium-label">Client Seed</label>
                  <input
                    className="premium-input"
                    value={clientSeed}
                    onChange={(e) => setClientSeed(e.target.value)}
                    placeholder="Enter seed..."
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Used to generate deterministic drop paths. Save it to verify fairness later.
                  </p>
                </div>

                <div>
                  <label className="premium-label">Bet Amount (USD)</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={betAmount}
                    min={0}
                    step={0.01}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    placeholder="1.00"
                  />
                </div>

                <div>
                  <label className="premium-label">Drop Column</label>
                  <input
                    type="number"
                    className="premium-input"
                    value={dropColumn}
                    min={0}
                    max={12}
                    onChange={(e) => setDropColumn(Number(e.target.value))}
                    placeholder="6"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Starting slot (0 to 12) from left to right.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDrop}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 h-12 text-sm font-bold text-white shadow-lg shadow-cyan-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Dropping Ball...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Drop Ball
                  </>
                )}
              </button>
            </div>

            {result && (
              <RoundResult
                binIndex={result.binIndex}
                pegMapHash={result.pegMapHash}
                path={result.path}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
