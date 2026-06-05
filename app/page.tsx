"use client";

import React, { useState } from "react";
import PlinkoBoard from "./components/PlinkoBoard";
import RoundResult from "./components/RoundResult";

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
      const commitRes = await fetch('/api/rounds/commit', { method: 'POST' });
      if (!commitRes.ok) throw new Error('Commit failed');
      const { roundId } = await commitRes.json();

      const startRes = await fetch(`/api/rounds/${roundId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSeed,
          betCents: Math.round(betAmount * 100),
          dropColumn,
        }),
      });

      if (!startRes.ok) {
        const err = await startRes.json().catch(() => ({}));
        throw new Error(err?.error || 'Start failed');
      }

      const data = await startRes.json();

      setResult({
        binIndex: data.binIndex,
        pegMapHash: data.pegMapHash,
        path: data.path,
      });
    } catch (e) {
      console.error(e);
      alert((e as Error).message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Provably Fair Plinko Lab</h1>
          <div className="text-sm text-zinc-500">Client-side demo</div>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PlinkoBoard rows={12} bins={13} path={result?.path ?? []} />
          </div>

          <aside className="space-y-4">
            <div className="p-4 bg-white rounded-xl shadow">
              <label className="block text-sm font-medium text-zinc-600">Client Seed</label>
              <input
                className="mt-2 w-full rounded-md border px-3 py-2"
                value={clientSeed}
                onChange={(e) => setClientSeed(e.target.value)}
              />
            </div>

            <div className="p-4 bg-white rounded-xl shadow">
              <label className="block text-sm font-medium text-zinc-600">Bet Amount (USD)</label>
              <input
                type="number"
                className="mt-2 w-full rounded-md border px-3 py-2"
                value={betAmount}
                min={0}
                step={0.01}
                onChange={(e) => setBetAmount(Number(e.target.value))}
              />
            </div>

            <div className="p-4 bg-white rounded-xl shadow">
              <label className="block text-sm font-medium text-zinc-600">Drop Column</label>
              <input
                type="number"
                className="mt-2 w-full rounded-md border px-3 py-2"
                value={dropColumn}
                min={0}
                max={12}
                onChange={(e) => setDropColumn(Number(e.target.value))}
              />
            </div>

            <div className="p-4 bg-white rounded-xl shadow">
              <button
                className="w-full rounded-md bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600"
                onClick={handleDrop}
                disabled={loading}
              >
                {loading ? 'Dropping...' : 'Drop Ball'}
              </button>
            </div>

            {result && (
              <RoundResult binIndex={result.binIndex} pegMapHash={result.pegMapHash} path={result.path} />
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}
