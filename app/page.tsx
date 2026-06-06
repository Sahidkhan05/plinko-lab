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
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6rem] top-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[-4rem] top-64 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <div className="text-lg font-semibold tracking-[0.22em] text-white/90 uppercase">
              Plinko Lab
            </div>
            <div className="text-xs text-slate-400">
              Provably fair experimentation
            </div>
          </div>
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-white/5 px-4 py-2 text-sm font-medium text-cyan-200 shadow-lg shadow-cyan-950/20 transition hover:border-cyan-300/50 hover:bg-white/10 hover:text-white"
          >
            <Sparkles className="h-4 w-4" />
            Verify Round
          </Link>
        </div>
      </nav>

      <section className="px-4 pb-10 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
            Fairness you can inspect
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent">
              Modern Plinko
            </span>
            <br />
            <span className="text-white/95">with a sharper interface</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Deterministic, verifiable, and designed to feel clean on every
            screen size.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/7 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6 lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <HelpCircle className="h-5 w-5 text-cyan-200" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  How It Works
                </h2>
                <p className="text-sm text-slate-400">
                  Start with your inputs, then follow the generated path to the
                  final bin.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/35 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-100">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-200">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/7 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-6">
            <h2 className="text-lg font-semibold text-white">
              How Verification Works
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              After a round, use the revealed server seed with your client seed,
              nonce, and drop column. Matching inputs recreate the same path and
              winning bin, so the result can be checked independently.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <PlinkoBoard rows={12} bins={13} path={result?.path ?? []} />
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/7 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-6">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/15 text-xs text-cyan-100">
                  1
                </span>
                Input
                <ArrowRight className="h-4 w-4 text-slate-500" />
                Path
                <ArrowRight className="h-4 w-4 text-slate-500" />
                Bin
                <ArrowRight className="h-4 w-4 text-slate-500" />
                Verify
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Create the drop, read the path, check the winning bin, then
                verify the round with the same inputs.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/7 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-6">
              <label className="mb-3 block text-sm font-medium text-cyan-200">
                Client Seed
              </label>
              <p className="mb-3 text-xs leading-5 text-slate-400">
                Your seed is part of the fairness input. Save it if you want to
                verify this exact drop later.
              </p>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                value={clientSeed}
                onChange={(e) => setClientSeed(e.target.value)}
                placeholder="Enter seed..."
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/7 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-6">
              <label className="mb-3 block text-sm font-medium text-cyan-200">
                Bet Amount (USD)
              </label>
              <input
                type="number"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                value={betAmount}
                min={0}
                step={0.01}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/7 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-6">
              <label className="mb-3 block text-sm font-medium text-cyan-200">
                Drop Column
              </label>
              <p className="mb-3 text-xs leading-5 text-slate-400">
                Choose the starting column for the ball. This board accepts
                columns 0 through 12.
              </p>
              <input
                type="number"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none transition focus:border-fuchsia-300/60 focus:ring-2 focus:ring-fuchsia-400/25"
                value={dropColumn}
                min={0}
                max={12}
                onChange={(e) => setDropColumn(Number(e.target.value))}
                placeholder="0-12"
              />
            </div>

            <button
              onClick={handleDrop}
              disabled={loading}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-2xl shadow-cyan-950/30 transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_45%)] opacity-80" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="shimmer absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </div>
              <span className="relative inline-flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Dropping...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Drop Ball
                  </>
                )}
              </span>
            </button>

            {result && (
              <RoundResult
                binIndex={result.binIndex}
                pegMapHash={result.pegMapHash}
                path={result.path}
              />
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}
