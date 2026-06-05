"use client";

import React, { useState } from "react";

export default function VerifyPage() {
  const [serverSeed, setServerSeed] = useState("");
  const [clientSeed, setClientSeed] = useState("");
  const [nonce, setNonce] = useState("");
  const [dropColumn, setDropColumn] = useState<number>(6);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | {
    commitHex: string;
    combinedSeed: string;
    pegMapHash: string;
    binIndex: number;
    path: ("L" | "R")[];
  }>(null);

  async function handleVerify() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serverSeed, clientSeed, nonce, dropColumn }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Verify failed");
      }

      const data = await res.json();

      setResult({
        commitHex: data.commitHex,
        combinedSeed: data.combinedSeed,
        pegMapHash: data.pegMapHash,
        binIndex: data.binIndex,
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
    <div className="min-h-screen bg-zinc-50 p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Verify Round</h1>
          <p className="text-sm text-zinc-500">Recompute and verify a round result</p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-white rounded-xl shadow">
            <label className="block text-sm font-medium text-zinc-600">Server Seed</label>
            <input className="mt-2 w-full rounded-md border px-3 py-2" value={serverSeed} onChange={(e) => setServerSeed(e.target.value)} />
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <label className="block text-sm font-medium text-zinc-600">Client Seed</label>
            <input className="mt-2 w-full rounded-md border px-3 py-2" value={clientSeed} onChange={(e) => setClientSeed(e.target.value)} />
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <label className="block text-sm font-medium text-zinc-600">Nonce</label>
            <input className="mt-2 w-full rounded-md border px-3 py-2" value={nonce} onChange={(e) => setNonce(e.target.value)} />
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <label className="block text-sm font-medium text-zinc-600">Drop Column</label>
            <input type="number" className="mt-2 w-full rounded-md border px-3 py-2" value={dropColumn} onChange={(e) => setDropColumn(Number(e.target.value))} />
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <button onClick={handleVerify} disabled={loading} className="w-full rounded-md bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600">
              {loading ? "Verifying..." : "Verify Round"}
            </button>
          </div>

          {result && (
            <div className="p-4 bg-white rounded-xl shadow">
              <div className="text-sm text-zinc-600">Commit Hex: <div className="break-words text-xs text-zinc-500">{result.commitHex}</div></div>
              <div className="mt-2 text-sm text-zinc-600">Peg Map Hash: <div className="break-words text-xs text-zinc-500">{result.pegMapHash}</div></div>
              <div className="mt-2 text-sm text-zinc-600">Bin Index: <span className="ml-2">{result.binIndex}</span></div>
              <div className="mt-2 text-sm text-zinc-600">Path: <div className="text-xs text-zinc-500">{result.path.join("")}</div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
