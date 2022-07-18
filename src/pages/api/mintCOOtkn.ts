import type { NextApiRequest, NextApiResponse } from "next";
import { tokenID, tokenMint, tokenTransfer } from "../../utils/hedera/tokenService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const amount = Math.floor(req.body.amount * 1000);
  const receiver = req.body.receiver;

  tokenMint({ tokenId: tokenID, amount })
    .then((mintSuccess) => {
      console.log("Did mint?", mintSuccess);
      return tokenTransfer(tokenID, amount, 0, receiver);
    })
    .then((transfRes) => console.log("transfer result", transfRes))
    .catch((err) => console.log(err));

  res.status(200).end();
}
