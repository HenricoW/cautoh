import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "./_app";
import { HashConnector } from "../utils/hashpack";
import { getBals, shortenStr } from "../utils/helpers";
import type { HashConnectProvider } from "hashconnect/dist/provider/provider";

const hashConnector = new HashConnector();
type CopyMssg = "Copy Pair String" | "Copied!" | "Please try again";

const Connect = () => {
  const [pairStr, setPairStr] = useState("");
  const [copyStatus, setCopyStatus] = useState<CopyMssg>("Copy Pair String");
  const [prov, setProv] = useState<HashConnectProvider>();

  const { userAcc, setUserAcc, setHPsigner, setHbarBal, setTokenBal, setIsMobileLink } = useContext(AppContext);

  useEffect(() => {
    hashConnector
      .initHashconnect()
      .then(() => {
        if (hashConnector.status !== "Paired") awaitPairing();
        else {
          setUserAcc(hashConnector.saveData.pairedAccounts[0]);
          getSigner();
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const connectWallet = () => {
    setPairStr(hashConnector.saveData.pairingString);
  };

  const awaitPairing = () => {
    hashConnector.hashconnect.pairingEvent.once((data) => {
      console.log("Paired with wallet:", data);

      hashConnector.status = "Paired";
      hashConnector.saveData.pairedWalletData = data.metadata;

      data.accountIds.forEach((id) => {
        if (hashConnector.saveData.pairedAccounts.indexOf(id) == -1) hashConnector.saveData.pairedAccounts.push(id);
      });

      hashConnector.saveDataInLocalstorage();
      getSigner();
      setUserAcc(data.accountIds[0]);
      setIsMobileLink(false);
    });
  };

  const getSigner = async () => {
    const provider = hashConnector.hashconnect.getProvider(
      "testnet",
      hashConnector.saveData.topic,
      hashConnector.saveData.pairedAccounts[0]
    );
    const signer = hashConnector.hashconnect.getSigner(provider);

    setProv(provider);
    setHPsigner(signer);

    await updateBals();
  };

  const updateBals = async () => {
    const { hbar, token } = await getBals(userAcc);
    setHbarBal(hbar);
    setTokenBal(token);
  };

  const copyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => setCopyStatus("Copied!"))
      .catch((err) => {
        console.log(err);
        setCopyStatus("Please try again");
      });
  };

  return (
    <div className="acc-page">
      {pairStr && (
        <>
          <ol>
            <li>Copy this pairing string</li>
            <li>Log into your browser wallet</li>
            <li>Select/Create a testnet account</li>
            <li>Select globe icon in top-right</li>
            <li>Select "Connect dApp"</li>
            <li>Paste the copied Pair String</li>
            <li>Select an account</li>
            <li>Hit "Approve"</li>
          </ol>
          <h3>{shortenStr(pairStr, 20)}</h3>
          <button className="config-btn" onClick={() => copyText(pairStr)}>
            {copyStatus}
          </button>
        </>
      )}

      {userAcc ? (
        <div className="success-text">Connected!</div>
      ) : (
        <button className="config-btn" onClick={connectWallet}>
          Connect with HashPack
        </button>
      )}
    </div>
  );
};

export default Connect;
