import type { NextApiRequest, NextApiResponse } from "next";
import { accountGetInfo } from "../../utils/hedera/accountInfo";
import { tokenID } from "../../utils/hedera/tokenService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accId = req.body.accId;
  const accInfo = await accountGetInfo(accId || process.env.OP_ID, tokenID);

  console.log("accInfo", accInfo);
  res.status(200).json({ bal: accInfo });
}
