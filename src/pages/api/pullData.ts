import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { dotsToDashes } from "../../utils/helpers";
import { PullDataResponse } from "../../utils/types";

export default function handler(req: NextApiRequest, res: NextApiResponse<PullDataResponse>) {
  const accID: string = req.body.accID;

  fs.readFile("src/pages/api/data/" + dotsToDashes(accID) + ".txt", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: true, message: "Error reading data", data: "" });
    } else {
      res.status(200).json({ error: false, message: "Data retreived", data });
    }

    res.end();
  });
}
