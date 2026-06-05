import { NextResponse, type NextRequest } from "next/server";

import {
  generateCommit,
  generateCombinedSeed,
  seedFromCombinedSeed,
} from "../../../lib/fairness";
import { sha256 } from "../../../lib/hash";
import { runPlinko } from "../../../lib/plinkoEngine";

export async function POST(request: NextRequest) {
  try {
    const { serverSeed, clientSeed, nonce, dropColumn } =
      await request.json();

    if (!serverSeed || !clientSeed || !nonce || dropColumn === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields: serverSeed, clientSeed, nonce, dropColumn",
        },
        { status: 400 }
      );
    }

    if (typeof serverSeed !== "string") {
      return NextResponse.json(
        { error: "serverSeed must be a string" },
        { status: 400 }
      );
    }

    if (typeof clientSeed !== "string") {
      return NextResponse.json(
        { error: "clientSeed must be a string" },
        { status: 400 }
      );
    }

    if (typeof nonce !== "string") {
      return NextResponse.json(
        { error: "nonce must be a string" },
        { status: 400 }
      );
    }

    if (typeof dropColumn !== "number" || dropColumn < 0) {
      return NextResponse.json(
        { error: "dropColumn must be a non-negative number" },
        { status: 400 }
      );
    }

    const commitHex = generateCommit(serverSeed, nonce);

    const combinedSeed = generateCombinedSeed(
      serverSeed,
      clientSeed,
      nonce
    );

    const seedNumber = seedFromCombinedSeed(combinedSeed);

    const { pegMap, path, binIndex } = runPlinko(
      seedNumber,
      dropColumn,
      12
    );

    const pegMapHash = sha256(JSON.stringify(pegMap));

    return NextResponse.json({
      commitHex,
      combinedSeed,
      pegMapHash,
      binIndex,
      path,
    });
  } catch (error) {
    console.error("Failed to verify game", error);
    return NextResponse.json(
      { error: "Unable to verify game parameters" },
      { status: 500 }
    );
  }
}
