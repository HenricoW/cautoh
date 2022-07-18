import { hederaClient } from "./client";
const {
  PrivateKey,
  TokenCreateTransaction,
  TokenAssociateTransaction,
  TokenGrantKycTransaction,
  TokenInfoQuery,
  TokenMintTransaction,
  Hbar,
  Status,
} = require("@hashgraph/sdk");

export let tokenID = "0.0.47698222";
let theToken;

export async function tokenGetInfo(token) {
  const client = hederaClient();
  const tokenResponse = token;
  try {
    const info = await new TokenInfoQuery()
      .setTokenId(token.tokenId)
      .setMaxQueryPayment(new Hbar(0.001))
      .execute(client);

    tokenResponse.totalSupply = info.totalSupply;
    tokenResponse.kycKey = info.kycKey;
    tokenResponse.supplyKey = info.supplyKey;
    tokenResponse.expiry = info.expirationTime.toDate();
  } catch (err) {
    console.log(err.message);
  }

  return tokenResponse;
}

export async function tokenCreate(token) {
  let tokenResponse = {};
  const autoRenewPeriod = 7776000; // set to default 3 months
  const issuerAccount = process.env.OP_ID;

  try {
    let additionalSig = false;
    let sigKey;
    const tx = await new TokenCreateTransaction();
    tx.setTokenName(token.name);
    tx.setTokenSymbol(token.symbol.toUpperCase());
    tx.setDecimals(token.decimals);
    tx.setInitialSupply(token.initialSupply);
    tx.setTreasuryAccountId(token.treasuryId);
    tx.setAutoRenewAccountId(token.autoRenewAccountId);
    tx.setAutoRenewPeriod(autoRenewPeriod);

    if (token.adminKey) {
      sigKey = PrivateKey.fromString(process.env.OP_SK);
      tx.setAdminKey(sigKey.publicKey);
      additionalSig = true;
    }
    if (token.kycKey) {
      sigKey = PrivateKey.fromString(process.env.OP_SK);
      tx.setKycKey(sigKey.publicKey);
      additionalSig = true;
    }
    if (token.freezeKey) {
      sigKey = PrivateKey.fromString(process.env.OP_SK);
      tx.setFreezeKey(sigKey.publicKey);
      additionalSig = true;
      tx.setFreezeDefault(token.defaultFreezeStatus);
    } else {
      tx.setFreezeDefault(false);
    }
    if (token.wipeKey) {
      additionalSig = true;
      sigKey = PrivateKey.fromString(process.env.OP_SK);
      tx.setWipeKey(sigKey.publicKey);
    }
    if (token.supplyKey) {
      additionalSig = true;
      sigKey = PrivateKey.fromString(process.env.OP_SK);
      tx.setSupplyKey(sigKey.publicKey);
    }
    const client = hederaClient();

    await tx.signWithOperator(client);

    if (additionalSig) {
      // TODO: should sign with every key (check docs)
      // since the admin/kyc/... keys are all the same, a single sig is sufficient
      await tx.sign(sigKey);
    }
    const response = await tx.execute(client);
    const transactionReceipt = await response.getReceipt(client);

    if (transactionReceipt.status !== Status.Success) {
      console.log(transactionReceipt.status.toString());
    } else {
      token.tokenId = transactionReceipt.tokenId;

      const transaction = {
        id: response.transactionId.toString(),
        type: "tokenCreate",
        inputs:
          "Name=" +
          token.name +
          ", Symbol=" +
          token.symbol.toUpperCase() +
          ", Decimals=" +
          token.decimals +
          ", Supply=" +
          token.initialSupply +
          ", ...",
        outputs: "tokenId=" + token.tokenId.toString(),
      };
      console.log("addTransaction", transaction);

      const tokenInfo = await tokenGetInfo(token);
      theToken = tokenInfo;
      tokenID = token.tokenId.toString();
      console.log("token info:", tokenInfo);
      console.log("token ID:", tokenID);

      tokenResponse = {
        tokenId: token.tokenId.toString(),
        symbol: token.symbol.toUpperCase(),
        name: token.name,
        totalSupply: token.initialSupply,
        decimals: token.decimals,
        autoRenewAccount: issuerAccount,
        autoRenewPeriod: autoRenewPeriod,
        defaultFreezeStatus: token.defaultFreezeStatus,
        kycKey: token.kycKey,
        wipeKey: token.wipeKey,
        freezeKey: token.freezeKey,
        adminKey: token.adminKey,
        supplyKey: token.supplyKey,
        expiry: tokenInfo.expiry,
        isDeleted: false,
        treasury: issuerAccount,
      };

      // automatically associate, grant, etc... for marketplace
      tokenAssociate(token.tokenId).then(() => {
        console.log("token association successful");
        // if (token.kycKey) {
        //   const instruction = {
        //     tokenId: token.tokenId,
        //     accountId: process.env.OP_ID,
        //   };
        //   tokenGrantKYC(instruction);
        // }
        // if (token.freezeKey && token.defaultFreezeStatus) {
        //   const instruction = {
        //     tokenId: token.tokenId,
        //     accountId: marketAccountId,
        //   };
        //   tokenUnFreeze(instruction);
        // }
      });
      console.log("token creation successful");
    }
    return tokenResponse;
  } catch (err) {
    console.log(err.message);
    return {};
  }
}

async function tokenAssociationTransaction(transaction, tokenId) {
  const client = hederaClient();

  const userKey = PrivateKey.fromString(process.env.OP_SK);

  try {
    transaction.setTokenIds([tokenId]);
    transaction.setAccountId(process.env.OP_ID);

    await transaction.signWithOperator(client);
    await transaction.sign(userKey);

    const response = await transaction.execute(client);

    const transactionReceipt = await response.getReceipt(client);
    if (transactionReceipt.status !== Status.Success) {
      return {
        status: false,
      };
    }

    return {
      status: true,
      transactionId: response.transactionId.toString(),
    };
  } catch (err) {
    return {
      status: false,
    };
  }
}

export async function tokenAssociate(tokenId) {
  const tx = await new TokenAssociateTransaction();
  const result = await tokenAssociationTransaction(tx, tokenId);

  return result.status;
}

async function tokenTransactionWithAmount(client, transaction, { tokenId, accountId, amount, successMessage }, key) {
  try {
    console.log("instruction:", tokenId, accountId, amount, successMessage);
    transaction.setTokenId(tokenId);
    transaction.setAmount(amount);
    if (typeof accountId !== "undefined") transaction.setAccountId(process.env.OP_ID);

    await transaction.freezeWith(client);
    await transaction.sign(key);

    const response = await transaction.execute(client);

    const transactionReceipt = await response.getReceipt(client);
    if (transactionReceipt.status !== Status.Success) {
      console.log(transactionReceipt.status.toString());
      return {
        status: false,
        transactionId: "",
      };
    }
    console.log(successMessage);

    return {
      status: true,
      transactionId: response.transactionId.toString(),
    };
  } catch (err) {
    console.log(err.message);

    return {
      status: false,
      transactionId: "",
    };
  }
}

async function tokenTransactionWithIdAndAccount(client, transaction, instruction, key) {
  try {
    transaction.setTokenId(instruction.tokenId);
    transaction.setAccountId(instruction.accountId);

    await transaction.signWithOperator(client);
    await transaction.sign(key);

    const response = await transaction.execute(client);

    const transactionReceipt = await response.getReceipt(client);
    if (transactionReceipt.status !== Status.Success) {
      console.log(transactionReceipt.status.toString());
      return {
        status: false,
        transactionId: "",
      };
    }

    console.log(instruction.successMessage);
    return {
      status: true,
      transactionId: response.transactionId.toString(),
    };
  } catch (err) {
    console.log(err.message);
    return {
      status: false,
      transactionId: "",
    };
  }
}

export async function tokenMint(instruction) {
  instruction.successMessage = "Minted " + instruction.amount + " for token " + instruction.tokenId;
  console.log("mint: the token", theToken);

  const client = hederaClient();
  const tx = await new TokenMintTransaction();
  const supplyKey = PrivateKey.fromString(process.env.OP_SK);
  const result = await tokenTransactionWithAmount(client, tx, instruction, supplyKey);

  return result.status;
}

export async function tokenGrantKYC(instruction) {
  const token = theToken;
  const kycKey = PrivateKey.fromString(token.kycKey);

  const tx = await new TokenGrantKycTransaction();
  const client = hederaClient();

  instruction.successMessage = "Account " + instruction.accountId + " KYC Granted";
  const result = await tokenTransactionWithIdAndAccount(client, tx, instruction, kycKey);

  if (result.status) {
    const transaction = {
      id: result.transactionId,
      type: "tokenGrantKYC",
      inputs: "tokenId=" + instruction.tokenId + ", AccountId=" + instruction.accountId,
    };
    console.log("addTransaction", transaction);
  }

  return result.status;
}
