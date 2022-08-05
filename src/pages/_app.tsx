import type { AppProps } from "next/app";
import { createContext, useState } from "react";
import type { SetStateAction } from "react";

import type { HashConnectSigner } from "hashconnect/dist/provider/signer";

import RouteBtn from "../components/Buttons/RouteBtn";

import "../index.css";
import type { AppContextType } from "../types";

const initContext: AppContextType = {
  userAcc: "",
  setUserAcc: (acc: SetStateAction<string>) => {},
  HPsigner: undefined,
  setHPsigner: (sig: SetStateAction<HashConnectSigner | undefined>) => {},
  hbarBal: "",
  setHbarBal: (bal: SetStateAction<string>) => {},
  tokenBal: 0,
  setTokenBal: (bal: SetStateAction<number>) => {},
  setIsMobileLink: (isLinked: SetStateAction<boolean>) => {},
};

export const AppContext = createContext<AppContextType>(initContext);
export type CopyMssg = "Click to copy" | "Copied!" | "Please try again";

function App({ Component, pageProps }: AppProps) {
  const [userAcc, setUserAcc] = useState("");
  const [HPsigner, setHPsigner] = useState<HashConnectSigner>();
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
      <AppContext.Provider
        value={{
          userAcc,
          setUserAcc,
          HPsigner,
          setHPsigner,
          hbarBal,
          setHbarBal,
          tokenBal,
          setTokenBal,
          setIsMobileLink,
        }}
      >
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
      </AppContext.Provider>
    </div>
  );
}

export default App;
