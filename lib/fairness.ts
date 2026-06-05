import { sha256 } from "./hash";

export function generateCommit(
  serverSeed: string,
  nonce: string
): string {
  return sha256(`${serverSeed}:${nonce}`);
}

export function generateCombinedSeed(
  serverSeed: string,
  clientSeed: string,
  nonce: string
): string {
  return sha256(
    `${serverSeed}:${clientSeed}:${nonce}`
  );
}

export function seedFromCombinedSeed(
  combinedSeed: string
): number {
  return parseInt(
    combinedSeed.slice(0, 8),
    16
  );
}