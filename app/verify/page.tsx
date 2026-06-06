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
    <main className="min-h-screen px-6 py-10 lg:py-16 text-slate-100 flex flex-col bg-[#090a0f]">
      <div className="mx-auto max-w-2xl w-full flex-1 flex flex-col justify-center space-y-6">
        <div className="flex items-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-xl border border-[#272d40] bg-[#12141c] hover:bg-[#1b1f2b] px-4 py-2.5 text-xs font-semibold text-slate-300 transition"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="premium-card p-6 md:p-10 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-wide text-white">
              Verify Round
            </h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Confirm the cryptographic fairness and deterministic path generation of any Plinko drop.
            </p>

            <div className="mt-6 rounded-xl border border-[#1e2230] bg-[#0d0f17] p-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
                How Verification Works
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verification reruns the same calculation using the server seed, client seed, nonce, and drop column. Matching inputs always yield the identical path and winning bin.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="serverSeed" className="premium-label">
                  Server Seed
                </label>
                <input
                  id="serverSeed"
                  name="serverSeed"
                  type="text"
                  value={formData.serverSeed}
                  onChange={handleInputChange}
                  placeholder="Enter server seed..."
                  required
                  className="premium-input"
                />
              </div>

              <div>
                <label htmlFor="clientSeed" className="premium-label">
                  Client Seed
                </label>
                <input
                  id="clientSeed"
                  name="clientSeed"
                  type="text"
                  value={formData.clientSeed}
                  onChange={handleInputChange}
                  placeholder="Enter client seed..."
                  required
                  className="premium-input"
                />
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  This must match the client seed supplied when playing the round.
                </p>
              </div>

              <div>
                <label htmlFor="nonce" className="premium-label">
                  Nonce
                </label>
                <input
                  id="nonce"
                  name="nonce"
                  type="text"
                  value={formData.nonce}
                  onChange={handleInputChange}
                  placeholder="Enter nonce..."
                  required
                  className="premium-input"
                />
              </div>

              <div>
                <label htmlFor="dropColumn" className="premium-label">
                  Drop Column
                </label>
                <input
                  id="dropColumn"
                  name="dropColumn"
                  type="number"
                  min="0"
                  value={formData.dropColumn}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="premium-input"
                />
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Starting drop column index (0 to 12).
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 h-12 text-sm font-bold text-white shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <span>Verify Round</span>
                )}
              </button>
            </form>

            {error && !loading && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-400 text-sm">
                    Verification Failed
                  </h3>
                  <p className="text-xs text-red-400/80 mt-1 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {response && submitted && !loading && (
              <div className="mt-8 space-y-6 border-t border-[#1e2230] pt-6">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-emerald-400 text-sm">
                      Verification Successful
                    </h3>
                    <p className="text-xs text-emerald-400/80 mt-1 leading-relaxed">
                      Round parameters verified and cryptographically proven.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-[#0d0f17] border border-[#1e2230] p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Commit Hex
                    </p>
                    <p className="break-all font-mono text-xs text-cyan-400 font-semibold bg-[#12141c] border border-[#1e2230] p-3 rounded-lg select-all">
                      {response.commitHex}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0d0f17] border border-[#1e2230] p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Peg Map Hash
                    </p>
                    <p className="break-all font-mono text-xs text-cyan-400 font-semibold bg-[#12141c] border border-[#1e2230] p-3 rounded-lg select-all">
                      {response.pegMapHash}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0d0f17] border border-[#1e2230] p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Bin Index
                    </p>
                    <div className="text-2xl font-extrabold text-white bg-[#12141c] border border-[#1e2230] py-2.5 rounded-lg text-center select-all">
                      {response.binIndex}
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#0d0f17] border border-[#1e2230] p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Path Output
                    </p>
                    <p className="break-all font-mono text-xs text-cyan-400 font-semibold bg-[#12141c] border border-[#1e2230] p-3 rounded-lg select-all">
                      {response.path.map((val) => (val === 0 ? "L" : "R")).join(" → ")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-[#1e2230] pt-6 sm:flex-row">
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
                    className="flex-1 rounded-xl border border-[#272d40] bg-[#12141c] hover:bg-[#1b1f2b] py-3 text-xs font-bold uppercase tracking-wider text-white transition cursor-pointer"
                  >
                    Verify Another
                  </button>
                  <Link
                    href="/"
                    className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-lg transition"
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
