const { Client, Hbar } = require("@hashgraph/sdk");
require("dotenv").config();

function checkProvided(environmentVariable) {
  return !(environmentVariable === null || typeof environmentVariable === "undefined");
}

export function hederaClient() {
  const operatorAccount = process.env.OP_ID;
  const operatorPrivateKey = process.env.OP_SK;

  if (!checkProvided(operatorPrivateKey) || !checkProvided(operatorAccount)) {
    throw new Error("environment variables OP_SK and OP_ID must be present");
  }
  return hederaClientLocal(operatorAccount, operatorPrivateKey);
}

function hederaClientLocal(operatorAccount, operatorPrivateKey) {
  if (!checkProvided(process.env.NETWORK)) {
    throw new Error("environment variable NETWORK must be set");
  }

  let client;
  switch (process.env.NETWORK.toUpperCase()) {
    case "TESTNET":
      client = Client.forTestnet();
      break;
    case "MAINNET":
      client = Client.forMainnet();
      break;
    default:
      throw new Error('environment variable NETWORK must be "testnet" or "mainnet"');
  }
  client.setOperator(operatorAccount, operatorPrivateKey);

  return client;
}
