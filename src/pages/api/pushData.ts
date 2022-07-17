import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { dotsToDashes } from "../../utils/helpers";
import { PushDataResponse } from "../../utils/types";

export default function handler(req: NextApiRequest, res: NextApiResponse<PushDataResponse>) {
  const accID: string = req.body.accID;

  fs.writeFile("src/pages/api/data/" + dotsToDashes(accID) + ".txt", JSON.stringify(req.body), "utf-8", (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: true, message: "Error adding data" });
    } else {
      res.status(201).json({ error: false, message: "Data added" });
    }

    res.end();
  });
}
