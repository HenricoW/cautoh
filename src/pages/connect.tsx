import React, { useState, useEffect, useContext } from "react";
import BaseBtn from "../components/Buttons/BaseBtn";
import { AppContext } from "./_app";
import { HashConnector } from "../utils/hashpack";
import { getBals, shortenStr } from "../utils/helpers";
import type { HashConnectProvider } from "hashconnect/dist/provider/provider";

const hashConnector = new HashConnector();
export type CopyMssg = "Copy Pair String" | "Copied!" | "Please try again";

const Connect = () => {
  const [pairStr, setPairStr] = useState("");
  const [copyStatus, setCopyStatus] = useState<CopyMssg>("Copy Pair String");
  const [prov, setProv] = useState<HashConnectProvider>();
  const [pairShowing, setPairShowing] = useState(false);

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
    setPairShowing(true);
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
    console.log("connect - updBals:", hashConnector.saveData.pairedAccounts[0]);
    const { hbar, token } = await getBals(hashConnector.saveData.pairedAccounts[0]);
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
      {pairStr && !userAcc && (
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
          <h2>{shortenStr(pairStr, 30)}</h2>
          <BaseBtn onClick={() => copyText(pairStr)}>{copyStatus}</BaseBtn>
        </>
      )}

      {userAcc ? (
        <div className="success-text">Connected!</div>
      ) : (
        !pairShowing && <BaseBtn onClick={connectWallet}>Connect with HashPack</BaseBtn>
      )}
    </div>
  );
};

export default Connect;
