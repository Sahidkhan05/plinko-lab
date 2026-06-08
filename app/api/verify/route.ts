import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "../../../lib/prisma";
import {
  generateCommit,
  generateCombinedSeed,
  seedFromCombinedSeed,
} from "../../../lib/fairness";
import { sha256 } from "../../../lib/hash";
import { runPlinko } from "../../../lib/plinkoEngine";

export async function GET(request: NextRequest) {
  const roundId = request.nextUrl.searchParams.get("roundId");

  if (!roundId) {
    return NextResponse.json(
      { error: "roundId query parameter is required" },
      { status: 400 }
    );
  }

  const round = await prisma.round.findUnique({
    where: { id: roundId },
    select: {
      id: true,
      serverSeed: true,
      clientSeed: true,
      nonce: true,
      dropColumn: true,
    },
  });

  if (!round) {
    return NextResponse.json({ error: "Round not found" }, { status: 404 });
  }

  if (!round.serverSeed) {
    return NextResponse.json(
      { error: "Round server seed is not available" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    roundId: round.id,
    serverSeed: round.serverSeed,
    clientSeed: round.clientSeed,
    nonce: round.nonce,
    dropColumn: round.dropColumn,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { roundId, serverSeed, clientSeed, nonce, dropColumn } =
      await request.json();

    if (!roundId || !serverSeed || !clientSeed || !nonce || dropColumn === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields: roundId, serverSeed, clientSeed, nonce, dropColumn",
        },
        { status: 400 }
      );
    }

    if (typeof roundId !== "string") {
      return NextResponse.json(
        { error: "roundId must be a string" },
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

    const round = await prisma.round.findUnique({
      where: { id: roundId },
      select: {
        serverSeed: true,
        clientSeed: true,
        nonce: true,
        dropColumn: true,
      },
    });

    if (!round) {
      return NextResponse.json({ error: "Round not found" }, { status: 404 });
    }

    if (serverSeed !== round.serverSeed) {
      return NextResponse.json({ error: "Server Seed Mismatch" }, { status: 400 });
    }

    if (clientSeed !== round.clientSeed) {
      return NextResponse.json({ error: "Client Seed Mismatch" }, { status: 400 });
    }

    if (nonce !== round.nonce) {
      return NextResponse.json({ error: "Nonce Mismatch" }, { status: 400 });
    }

    if (dropColumn !== round.dropColumn) {
      return NextResponse.json({ error: "Drop Column Mismatch" }, { status: 400 });
    }

    const commitHex = generateCommit(serverSeed, nonce);

    const combinedSeed = generateCombinedSeed(serverSeed, clientSeed, nonce);
    const seedNumber = seedFromCombinedSeed(combinedSeed);

    const { pegMap, path, binIndex } = runPlinko(seedNumber, dropColumn, 12);
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
