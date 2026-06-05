"use client";

import React from "react";

type Props = {
  rows: number;
  bins: number;
  path: ("L" | "R")[];
};

export default function PlinkoBoard({ rows, bins, path }: Props) {
  // compute ball positions for visualization
  const positions: number[] = [];
  let pos = 0;
  for (let row = 0; row < rows; row++) {
    const pegIndex = Math.min(pos, row);
    positions.push(pegIndex);
    if (path[row] === "R") pos++;
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Plinko Board</div>
          <div className="text-sm text-zinc-500">12 rows · Casino style</div>
        </div>

        <div className="relative w-full">
          <div className="flex flex-col items-center gap-4">
            {Array.from({ length: rows }).map((_, row) => (
              <div
                key={row}
                className="w-full max-w-xl"
                style={{ display: "grid", gridTemplateColumns: `repeat(${row + 1}, 1fr)` }}
              >
                {Array.from({ length: row + 1 }).map((__, i) => (
                  <div key={i} className="flex justify-center">
                    <div className="h-4 w-4 rounded-full bg-zinc-400 shadow-inner" />
                  </div>
                ))}

                {/* ball marker for this row */}
                <div
                  style={{
                    gridColumnStart: positions[row] + 1,
                    gridRowStart: 1,
                  }}
                  className="pointer-events-none row-marker"
                >
                  <div className="-mt-6 flex justify-center">
                    <div className="h-5 w-5 rounded-full bg-amber-500 border-2 border-amber-200 shadow-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="grid grid-cols-13 gap-2 max-w-xl mx-auto" style={{ gridTemplateColumns: `repeat(${bins}, 1fr)` }}>
              {Array.from({ length: bins }).map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-10 w-full rounded-t-md bg-zinc-200 flex items-end justify-center">
                    <div className="text-xs text-zinc-600">{i}</div>
                  </div>
                  <div className="h-6 w-full bg-zinc-100 border border-zinc-200 rounded-b-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React from "react";

interface PlinkoBoardProps {
  rows?: number;
  bins?: number;
  path?: ("L" | "R")[];
}

export default function PlinkoBoard({ rows = 12, bins = 13, path = [] }: PlinkoBoardProps) {
  // Render a simple responsive plinko board using Tailwind
  const rowsArray = Array.from({ length: rows }, (_, i) => i);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative bg-gradient-to-b from-zinc-50 to-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900">Plinko Board</h2>
          <div className="text-sm text-zinc-500">Rows: {rows} · Bins: {bins}</div>
        </div>

        <div className="overflow-hidden">
          <div className="plinko-board w-full">
            <div className="flex flex-col gap-4">
              {rowsArray.map((r) => (
                <div
                  key={r}
                  className="flex items-center justify-center"
                  style={{ height: 28 }}
                >
                  <div className={`flex items-center justify-center gap-6`}>
                    {Array.from({ length: r + 1 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-3 w-3 rounded-full bg-zinc-800/90 shadow-inner"
                        aria-hidden
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Bins */}
              <div
                className="mt-4 grid gap-2"
                style={{ gridTemplateColumns: `repeat(${bins}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: bins }).map((_, i) => (
                  <div key={i} className="flex items-end justify-center px-1">
                    <div className="h-12 w-full rounded-t-md bg-zinc-900/95 text-center text-xs text-white flex items-end justify-center pb-1">
                      {i}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Path overlay (simple visualization) */}
        {path.length > 0 && (
          <div className="mt-4 text-sm text-zinc-700">
            <div className="font-medium">Path</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {path.map((p, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center justify-center rounded-md bg-amber-100 text-amber-800 px-2 py-1 text-xs"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
