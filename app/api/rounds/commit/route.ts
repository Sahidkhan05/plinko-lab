import { NextResponse } from "next/server";
import crypto from "crypto";

import { prisma } from "../../../../lib/prisma";
import { generateCommit } from "../../../../lib/fairness";

export async function POST() {
  try {
    const serverSeed = crypto.randomBytes(32).toString("hex");
    const nonce = Date.now().toString();
    const commitHex = generateCommit(serverSeed, nonce);

    const round = await prisma.round.create({
      data: {
        status: "CREATED",
        nonce,
        commitHex,
        serverSeed,
        clientSeed: "",
        combinedSeed: "",
        pegMapHash: "",
        rows: 12,
        dropColumn: 6,
        binIndex: 0,
        payoutMultiplier: 1,
        betCents: 0,
        pathJson: "[]",
      },
    });

    return NextResponse.json(
      {
        roundId: round.id,
        commitHex,
        nonce,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create round commit", error);
    return NextResponse.json(
      {
        error: "Unable to create round commit.",
      },
      { status: 500 }
    );
  }
}
