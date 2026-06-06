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
        throw new Error(
          errorData.error || `HTTP Error: ${res.status}`
        );
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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header with navigation */}
        <div className="mb-8 flex items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Main card */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
          <h1 className="text-3xl font-bold text-white mb-2">Verify Round</h1>
          <p className="text-slate-400 mb-8">
            Enter your game parameters to verify the fairness and results of a
            Plinko round.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Server Seed */}
            <div>
              <label
                htmlFor="serverSeed"
                className="block text-sm font-medium text-white mb-2"
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
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Client Seed */}
            <div>
              <label
                htmlFor="clientSeed"
                className="block text-sm font-medium text-white mb-2"
              >
                Client Seed
              </label>
              <input
                id="clientSeed"
                name="clientSeed"
                type="text"
                value={formData.clientSeed}
                onChange={handleInputChange}
                placeholder="Enter client seed"
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Nonce */}
            <div>
              <label
                htmlFor="nonce"
                className="block text-sm font-medium text-white mb-2"
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
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Drop Column */}
            <div>
              <label
                htmlFor="dropColumn"
                className="block text-sm font-medium text-white mb-2"
              >
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
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Round</span>
              )}
            </button>
          </form>

          {/* Error State */}
          {error && !loading && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-500 mb-1">
                  Verification Failed
                </h3>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success State - Response Display */}
          {response && submitted && !loading && (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex gap-3 mb-6">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-500">
                    Verification Successful
                  </h3>
                  <p className="text-green-400 text-sm">
                    Round parameters verified successfully.
                  </p>
                </div>
              </div>

              {/* Response Details Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Commit Hex */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <p className="text-sm text-slate-400 font-medium mb-2">
                    Commit Hex
                  </p>
                  <p className="text-white font-mono text-sm break-all">
                    {response.commitHex}
                  </p>
                </div>

                {/* Peg Map Hash */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <p className="text-sm text-slate-400 font-medium mb-2">
                    Peg Map Hash
                  </p>
                  <p className="text-white font-mono text-sm break-all">
                    {response.pegMapHash}
                  </p>
                </div>

                {/* Bin Index */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <p className="text-sm text-slate-400 font-medium mb-2">
                    Bin Index
                  </p>
                  <p className="text-white font-mono text-sm font-bold text-lg">
                    {response.binIndex}
                  </p>
                </div>

                {/* Path */}
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <p className="text-sm text-slate-400 font-medium mb-2">
                    Path
                  </p>
                  <p className="text-white font-mono text-sm break-all">
                    [{response.path.join(", ")}]
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
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
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
                >
                  Verify Another
                </button>
                <Link
                  href="/"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
