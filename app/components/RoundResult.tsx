"use client";

import React from "react";

type Props = {
  binIndex: number;
  pegMapHash: string;
  path: ("L" | "R")[];
};

export default function RoundResult({
  binIndex,
  pegMapHash,
  path,
}: Props) {
  return (
    <div className="w-full rounded-xl bg-white p-4 shadow">
      <h3 className="text-lg font-semibold text-zinc-900">
        Round Result
      </h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-zinc-50 p-3">
          <div className="text-sm text-zinc-500">
            Bin Index
          </div>
          <div className="text-2xl font-bold">
            {binIndex}
          </div>
        </div>

        <div className="rounded-lg bg-zinc-50 p-3 sm:col-span-2">
          <div className="text-sm text-zinc-500">
            Peg Map Hash
          </div>

          <div className="mt-1 break-words font-mono text-xs text-zinc-700">
            {pegMapHash}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-zinc-500">
          Path
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {path.map((step, index) => (
            <span
              key={index}
              className="rounded-md bg-amber-100 px-2 py-1 text-xs text-amber-800"
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}