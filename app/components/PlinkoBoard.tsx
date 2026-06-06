"use client";

import React from "react";

type Props = {
  rows: number;
  bins: number;
  path: ("L" | "R")[];
};

export default function PlinkoBoard({
  rows,
  bins,
  path,
}: Props) {
  const positions: number[] = [];
  let pos = 0;

  for (let row = 0; row < rows; row++) {
    positions.push(pos);

    if (path[row] === "R") {
      pos++;
    }
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">
            Plinko Board
          </div>

          <div className="text-sm text-zinc-500">
            {rows} Rows · {bins} Bins
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {Array.from({ length: rows }).map((_, row) => (
            <div
              key={row}
              className="relative w-full max-w-xl"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${row + 1}, 1fr)`,
              }}
            >
              {Array.from({ length: row + 1 }).map(
                (_, peg) => (
                  <div
                    key={peg}
                    className="flex justify-center"
                  >
                    <div className="h-4 w-4 rounded-full bg-zinc-500 shadow-inner" />
                  </div>
                )
              )}

              {path.length > row && (
                <div
                  style={{
                    gridColumnStart:
                      positions[row] + 1,
                    gridRowStart: 1,
                  }}
                  className="pointer-events-none"
                >
                  <div className="-mt-6 flex justify-center">
                    <div className="h-5 w-5 rounded-full bg-amber-500 border-2 border-white shadow-md" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <div
            className="grid gap-2 max-w-xl mx-auto"
            style={{
              gridTemplateColumns: `repeat(${bins}, 1fr)`,
            }}
          >
            {Array.from({ length: bins }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                >
                  <div className="h-10 w-full rounded-t-md bg-zinc-800 text-white flex items-center justify-center text-xs">
                    {index}
                  </div>

                  <div className="h-6 w-full border border-zinc-300 bg-zinc-100 rounded-b-md" />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}