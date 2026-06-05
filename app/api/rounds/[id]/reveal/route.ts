import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "../../../../../lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const round = await prisma.round.findUnique({
      where: { id },
    });

    if (!round) {
      return NextResponse.json(
        { error: "Round not found" },
        { status: 404 }
      );
    }

    if (!round.serverSeed) {
      return NextResponse.json(
        { error: "Server seed not available for this round" },
        { status: 400 }
      );
    }

    const updatedRound = await prisma.round.update({
      where: { id },
      data: {
        status: "REVEALED",
        revealedAt: new Date(),
      },
    });

    return NextResponse.json({
      roundId: updatedRound.id,
      serverSeed: updatedRound.serverSeed,
      revealedAt: updatedRound.revealedAt,
    });
  } catch (error) {
    console.error("Failed to reveal round", error);
    return NextResponse.json(
      { error: "Unable to reveal round" },
      { status: 500 }
    );
  }
}
