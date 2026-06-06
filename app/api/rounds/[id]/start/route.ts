import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "../../../../../lib/prisma";
import {
  generateCombinedSeed,
  seedFromCombinedSeed,
} from "../../../../../lib/fairness";
import { sha256 } from "../../../../../lib/hash";
import { runPlinko } from "../../../../../lib/plinkoEngine";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }

  
) {

  console.log("START ROUTE HIT");
  try {
    const { clientSeed, betCents, dropColumn } = await request.json();
    const { id } = await params;

    if (!clientSeed || betCents === undefined || dropColumn === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: clientSeed, betCents, dropColumn" },
        { status: 400 }
      );
    }

    const round = await prisma.round.findUnique({
      where: { id },
    });

    if (!round) {
      return NextResponse.json(
        { error: "Round not found" },
        { status: 404 }
      );
    }

    if (round.status !== "CREATED") {
      return NextResponse.json(
        { error: "Round must be in CREATED status to start" },
        { status: 400 }
      );
    }

    const combinedSeed = generateCombinedSeed(
      round.serverSeed!,
      clientSeed,
      round.nonce
    );

    const numericSeed = seedFromCombinedSeed(combinedSeed);

    const { pegMap, path, binIndex } = runPlinko(
      numericSeed,
      dropColumn,
      12
    );

    const pegMapHash = sha256(JSON.stringify(pegMap));

    const updatedRound = await prisma.round.update({
      where: { id },
      data: {
        status: "STARTED",
        clientSeed,
        combinedSeed,
        pegMapHash,
        dropColumn,
        betCents,
        binIndex,
        pathJson: JSON.stringify(path),
      },
    });

    return NextResponse.json({
      roundId: updatedRound.id,
      pegMapHash,
      rows: 12,
      binIndex,
      path,
    });
  } catch (error) {
    console.error("Failed to start round", error);
    return NextResponse.json(
      { error: "Unable to start round" },
      { status: 500 }
    );
  }
}
