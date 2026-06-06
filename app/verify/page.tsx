"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Hash,
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react";

interface VerificationResponse {
  commitHex: string;
  pegMapHash: string;
  binIndex: number;
  path: number[];
}

export default function VerifyPage() {
  const [formData, setFormData] = useState({
    serverSeed: "",
    clientSeed: "",
    nonce: "",
    dropColumn: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<VerificationResponse | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "dropColumn"
          ? value === ""
            ? 0
            : Math.max(0, parseInt(value, 10))
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setSubmitted(false);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverSeed: formData.serverSeed,
          clientSeed: formData.clientSeed,
          nonce: formData.nonce,
          dropColumn: Number(formData.dropColumn),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP Error: ${res.status}`);
      }

      const data: VerificationResponse = await res.json();
      setResponse(data);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const readablePath = response?.path.map((v) => (v === 0 ? "L" : "R")).join(" → ");

  return (
    <div className="relative min-h-screen bg-[#04050a] text-slate-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#04050a]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-6 py-4.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/10 border border-cyan-500/20">
              <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-sm font-bold tracking-[0.18em] text-white uppercase leading-none mb-1">Plinko Lab</div>
              <div className="text-[9px] font-bold tracking-[0.22em] text-slate-500 uppercase leading-none">Provably Fair</div>
            </div>
          </div>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] px-4.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-all duration-200"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 mx-auto max-w-2xl w-full px-6 pt-16 pb-16 space-y-8">
        {/* Hero Card */}
        <div className="premium-card p-10 md:p-12">
          <div className="flex items-start gap-3.5 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <ShieldCheck className="h-5.5 w-5.5 text-cyan-400" />
            </div>
            <div className="flex flex-col justify-center gap-1">
              <h1 className="text-lg md:text-[1.375rem] font-bold tracking-tight leading-[1.05] text-white md:whitespace-nowrap">Verify Round</h1>
              <p className="text-[10px] text-slate-500">Cryptographic fairness proof</p>
            </div>
            <span className="ml-auto badge badge-cyan self-start">
              <Hash className="h-2.5 w-2.5" />
              SHA-256
            </span>
          </div>

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-cyan-400 mb-1.5">How it works</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verification reruns the same calculation using your server seed, client seed, nonce, and drop column. Matching inputs always yield the identical path and winning bin — proving the game was fair.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="serverSeed" className="premium-label">Server Seed</label>
              <input
                id="serverSeed"
                name="serverSeed"
                type="text"
                value={formData.serverSeed}
                onChange={handleInputChange}
                placeholder="Enter server seed..."
                required
                className="premium-input font-mono"
              />
            </div>

            <div>
              <label htmlFor="clientSeed" className="premium-label">Client Seed</label>
              <input
                id="clientSeed"
                name="clientSeed"
                type="text"
                value={formData.clientSeed}
                onChange={handleInputChange}
                placeholder="Enter client seed..."
                required
                className="premium-input font-mono"
              />
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                Must match the client seed used when the round was played.
              </p>
            </div>

            <div>
              <label htmlFor="nonce" className="premium-label">Nonce</label>
              <input
                id="nonce"
                name="nonce"
                type="text"
                value={formData.nonce}
                onChange={handleInputChange}
                placeholder="Enter nonce..."
                required
                className="premium-input font-mono"
              />
            </div>

            <div>
              <label htmlFor="dropColumn" className="premium-label flex items-center justify-between">
                <span>Drop Column</span>
                <span className="text-cyan-400 font-mono normal-case">{formData.dropColumn} / 12</span>
              </label>
              <input
                id="dropColumn"
                name="dropColumn"
                type="number"
                min="0"
                max="12"
                value={formData.dropColumn}
                onChange={handleInputChange}
                placeholder="0"
                className="premium-input"
              />
              <div className="mt-2 w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${(formData.dropColumn / 12) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5">Starting drop column index (0 to 12).</p>
            </div>

            <button
              type="submit"
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
                  <><Loader2 className="h-4 w-4 animate-spin" />Verifying...</>
                ) : (
                  <><ShieldCheck className="h-4 w-4" />Verify Round</>
                )}
              </span>
            </button>
          </form>

          {/* Error */}
          {error && !loading && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex gap-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-400 text-sm">Verification Failed</h3>
                <p className="text-xs text-red-400/70 mt-1 leading-relaxed">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {response && submitted && !loading && (
          <div className="premium-card p-6 md:p-8 space-y-5 card-glow-cyan">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <h3 className="font-bold text-emerald-400 text-sm">Verification Successful</h3>
                <p className="text-xs text-emerald-400/70 mt-0.5 leading-relaxed">
                  Round parameters verified and cryptographically proven fair.
                </p>
              </div>
            </div>

            {/* Winning Bin */}
            <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/5 border border-cyan-500/15 p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-500/70 mb-2">Winning Bin</p>
              <div className="text-6xl font-black text-white number-glow select-all">
                {response.binIndex}
              </div>
            </div>

            {/* Data grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Commit Hex */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Commit Hex</p>
                  <button
                    onClick={() => copyText(response.commitHex, "commit")}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-[10px] text-slate-500 hover:text-white transition-all"
                  >
                    {copiedKey === "commit" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <p className="break-all font-mono text-[11px] text-cyan-400 bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-lg select-all leading-relaxed">
                  {response.commitHex}
                </p>
              </div>

              {/* Peg Map Hash */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Peg Map Hash</p>
                  <button
                    onClick={() => copyText(response.pegMapHash, "peg")}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-[10px] text-slate-500 hover:text-white transition-all"
                  >
                    {copiedKey === "peg" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <p className="break-all font-mono text-[11px] text-cyan-400 bg-white/[0.02] border border-white/[0.04] p-2.5 rounded-lg select-all leading-relaxed">
                  {response.pegMapHash}
                </p>
              </div>

              {/* Path */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4 sm:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Path Output</p>
                  <button
                    onClick={() => copyText(readablePath ?? "", "path")}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-[10px] text-slate-500 hover:text-white transition-all"
                  >
                    {copiedKey === "path" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {response.path.map((val, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center justify-center h-6 w-6 rounded-lg text-[10px] font-bold font-mono ${val === 0
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                    >
                      {val === 0 ? "L" : "R"}
                    </span>
                  ))}
                </div>
                <p className="font-mono text-[10px] text-slate-600 break-all">{readablePath}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-white/[0.05] pt-5 sm:flex-row">
              <button
                onClick={() => {
                  setFormData({ serverSeed: "", clientSeed: "", nonce: "", dropColumn: 0 });
                  setResponse(null);
                  setError(null);
                  setSubmitted(false);
                }}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] py-3 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Verify Another
              </button>
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
                  boxShadow: "0 0 20px rgba(34,211,238,0.2)",
                }}
              >
                Back to Home
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-white/[0.04] py-5 px-5">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <p className="text-[11px] text-slate-600">© 2024 Plinko Lab</p>
          <span className="text-[11px] text-slate-600">Powered by SHA-256</span>
        </div>
      </footer>
    </div>
  );
}