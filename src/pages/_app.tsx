import type { AppProps } from "next/app";
import { useState } from "react";

import RouteBtn from "../components/Buttons/RouteBtn";

import "../index.css";
import AppContext from "../contexts/AppContext";

export type CopyMssg = "Click to copy" | "Copied!" | "Please try again";

function App({ Component, pageProps }: AppProps) {
  const [userAcc, setUserAcc] = useState("");
  const [hbarBal, setHbarBal] = useState("");
  const [tokenBal, setTokenBal] = useState(0);
  const [isMobileLink, setIsMobileLink] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyMssg>("Click to copy");

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
    <div className="app">
      <AppContext>
        <div className="circle"></div>
        <h2>C-Auto</h2>
        <h4>Track your Carbon emissions from driving</h4>

        {userAcc ? (
          <div className="acc-summary">
            <div className="acc-id">
              <p>Linked Account:</p>
              <p>{userAcc}</p>
            </div>
            {!isMobileLink && (
              <>
                <div className="cag-balance">
                  <p>CAG balance:</p>
                  <p>{tokenBal.toString()}</p>
                </div>
                <div className="acc-balance" onClick={() => copyText("0.0.47698769")}>
                  <p>tokenID:</p>
                  <p>{"0.0.47698769"}</p>
                  <p>{copyStatus}</p>
                </div>
                <div className="acc-balance">
                  <p>hbar balance:</p>
                  <p>{hbarBal}</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <RouteBtn text="Connect Wallet" route="connect" />
        )}

        <Component {...pageProps} />
      </AppContext>
    </div>
  );
}

export default App;
