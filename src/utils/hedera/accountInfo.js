import { hederaClient } from "./client";
const { AccountInfoQuery, Hbar } = require("@hashgraph/sdk");

export async function accountGetInfo(accountId, tokenId) {
  const client = hederaClient();

  try {
    // cycle token relationships
    let tokenRelationships = {};
    const info = await new AccountInfoQuery()
      .setAccountId(accountId)
      .setMaxQueryPayment(new Hbar(0.001))
      .execute(client);
    const hBarBalance = info.balance;

    for (let key of info.tokenRelationships.keys()) {
      const tokenRelationship = {
        tokenId: key.toString(),
        hbarBalance: hBarBalance.toString(),
        balance: info.tokenRelationships.get(key).balance.toString(),
        freezeStatus: info.tokenRelationships.get(key).isFrozen,
        kycStatus: info.tokenRelationships.get(key).isKycGranted,
      };
      tokenRelationships[key] = tokenRelationship;
    }

    if (tokenRelationships.hasOwnProperty(tokenId)) return tokenRelationships[tokenId];
    return undefined;
  } catch (err) {
    console.log("getAccountInfo " + err.message);
    return undefined;
  }
}
