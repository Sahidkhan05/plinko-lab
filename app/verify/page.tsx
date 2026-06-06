"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";

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
      const requestBody = {
        serverSeed: formData.serverSeed,
        clientSeed: formData.clientSeed,
        nonce: formData.nonce,
        dropColumn: Number(formData.dropColumn),
      };

      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP Error: ${res.status}`);
      }

      const data: VerificationResponse = await res.json();
      setResponse(data);
      setSubmitted(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/7 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_30%)]" />

          <div className="relative z-10">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Verify Round
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Enter the round inputs to confirm the fairness and result of a
              Plinko drop.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/35 p-4">
              <h2 className="text-sm font-semibold text-white">
                How Verification Works
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Verification reruns the same deterministic calculation using
                the server seed, client seed, nonce, and drop column. If the
                inputs match, the path and winning bin match too.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="serverSeed"
                  className="mb-2 block text-sm font-medium text-cyan-200"
                >
                  Server Seed
                </label>
                <input
                  id="serverSeed"
                  name="serverSeed"
                  type="text"
                  value={formData.serverSeed}
                  onChange={handleInputChange}
                  placeholder="Enter server seed"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-white placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                />
              </div>

              <div>
                <label
                  htmlFor="clientSeed"
                  className="mb-2 block text-sm font-medium text-cyan-200"
                >
                  Client Seed
                </label>
                <p className="mb-2 text-xs leading-5 text-slate-400">
                  This should be the same client seed used when the round was
                  played.
                </p>
                <input
                  id="clientSeed"
                  name="clientSeed"
                  type="text"
                  value={formData.clientSeed}
                  onChange={handleInputChange}
                  placeholder="Enter client seed"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-white placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                />
              </div>

              <div>
                <label
                  htmlFor="nonce"
                  className="mb-2 block text-sm font-medium text-cyan-200"
                >
                  Nonce
                </label>
                <input
                  id="nonce"
                  name="nonce"
                  type="text"
                  value={formData.nonce}
                  onChange={handleInputChange}
                  placeholder="Enter nonce"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-white placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                />
              </div>

              <div>
                <label
                  htmlFor="dropColumn"
                  className="mb-2 block text-sm font-medium text-cyan-200"
                >
                  Drop Column
                </label>
                <p className="mb-2 text-xs leading-5 text-slate-400">
                  Enter the original starting column for the drop.
                </p>
                <input
                  id="dropColumn"
                  name="dropColumn"
                  type="number"
                  min="0"
                  value={formData.dropColumn}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-white placeholder:text-slate-500 shadow-inner shadow-black/20 outline-none transition focus:border-fuchsia-300/60 focus:ring-2 focus:ring-fuchsia-400/25"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl px-6 py-4 text-base font-semibold text-white shadow-2xl shadow-cyan-950/30 transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_45%)] opacity-80" />
                <span className="relative inline-flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <span>Verify Round</span>
                  )}
                </span>
              </button>
            </form>

            {error && !loading && (
              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-300" />
                  <div>
                    <h3 className="font-semibold text-red-200">
                      Verification Failed
                    </h3>
                    <p className="text-sm text-red-100/80">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {response && submitted && !loading && (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <div className="flex gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-300" />
                    <div>
                      <h3 className="font-semibold text-emerald-100">
                        Verification Successful
                      </h3>
                      <p className="text-sm text-emerald-50/80">
                        Round parameters verified successfully.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="mb-2 text-sm font-medium text-slate-400">
                      Commit Hex
                    </p>
                    <p className="break-all font-mono text-sm text-white/90">
                      {response.commitHex}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="mb-2 text-sm font-medium text-slate-400">
                      Peg Map Hash
                    </p>
                    <p className="mb-2 text-xs leading-5 text-slate-500">
                      Identifies the peg layout used for this calculation.
                    </p>
                    <p className="break-all font-mono text-sm text-white/90">
                      {response.pegMapHash}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="mb-2 text-sm font-medium text-slate-400">
                      Bin Index
                    </p>
                    <p className="mb-2 text-xs leading-5 text-slate-500">
                      The final winning bin calculated from the path.
                    </p>
                    <p className="font-mono text-lg font-semibold text-white">
                      {response.binIndex}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
                    <p className="mb-2 text-sm font-medium text-slate-400">
                      Path
                    </p>
                    <p className="mb-2 text-xs leading-5 text-slate-500">
                      The generated movement sequence for the ball.
                    </p>
                    <p className="break-all font-mono text-sm text-white/90">
                      {response.path.join(" → ")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
                  <button
                    onClick={() => {
                      setFormData({
                        serverSeed: "",
                        clientSeed: "",
                        nonce: "",
                        dropColumn: 0,
                      });
                      setResponse(null);
                      setError(null);
                      setSubmitted(false);
                    }}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white transition hover:bg-white/10"
                  >
                    Verify Another
                  </button>
                  <Link
                    href="/"
                    className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-fuchsia-500 px-4 py-3 text-center font-medium text-white shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
