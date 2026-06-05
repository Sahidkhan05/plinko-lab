import { createXorShift32 } from "./random";

export interface PlinkoResult {
  pegMap: number[][];
  path: ("L" | "R")[];
  binIndex: number;
}

export function runPlinko(
  seed: number,
  dropColumn: number,
  rows = 12
): PlinkoResult {
  const rand = createXorShift32(seed);

  const pegMap: number[][] = [];

  for (let row = 0; row < rows; row++) {
    const pegs: number[] = [];

    for (let i = 0; i <= row; i++) {
      const leftBias =
        Number(
          (
            0.5 +
            (rand() - 0.5) * 0.2
          ).toFixed(6)
        );

      pegs.push(leftBias);
    }

    pegMap.push(pegs);
  }

  const path: ("L" | "R")[] = [];

  let pos = 0;

  const adj =
    (dropColumn - Math.floor(rows / 2)) *
    0.01;

  for (let row = 0; row < rows; row++) {
    const pegIndex = Math.min(pos, row);

    let bias =
      pegMap[row][pegIndex] + adj;

    bias = Math.max(
      0,
      Math.min(1, bias)
    );

    const rnd = rand();

    if (rnd < bias) {
      path.push("L");
    } else {
      path.push("R");
      pos++;
    }
  }

  return {
    pegMap,
    path,
    binIndex: pos,
  };
}