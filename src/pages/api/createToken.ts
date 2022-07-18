import type { NextApiRequest, NextApiResponse } from "next";
import { tokenCreate } from "../../utils/hedera/tokenService";
require("dotenv").config();

const token = {
  name: "cAuto grams of CO2",
  symbol: "cAg",
  decimals: 3,
  initialSupply: 0,
  treasuryId: process.env.OP_ID,
  autoRenewAccountId: process.env.OP_ID,
  adminKey: true,
  kycKey: false,
  freezeKey: false,
  defaultFreezeStatus: false,
  wipeKey: true,
  supplyKey: true,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const resp = await tokenCreate(token);

  console.log("created token:", resp);
  res.status(200).end();
}
