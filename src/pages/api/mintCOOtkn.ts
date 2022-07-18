import type { NextApiRequest, NextApiResponse } from "next";
import { tokenID, tokenMint } from "../../utils/hedera/tokenService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const amount = Math.floor(req.body.amount * 1000);
  const mintSuccess = await tokenMint({ tokenId: tokenID, amount });

  console.log("Did mint?", mintSuccess);
  res.status(200).end();
}
