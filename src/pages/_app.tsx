import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { createContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import "../index.css";
import type { HashConnectSigner } from "hashconnect/dist/provider/signer";

interface ContextType {
  userAcc: string;
  setUserAcc: Dispatch<SetStateAction<string>>;
  HPsigner: HashConnectSigner | undefined;
  setHPsigner: Dispatch<SetStateAction<HashConnectSigner | undefined>>;
  hbarBal: string;
  setHbarBal: Dispatch<SetStateAction<string>>;
  tokenBal: number;
  setTokenBal: Dispatch<SetStateAction<number>>;
  setIsMobileLink: Dispatch<SetStateAction<boolean>>;
}

const initContext: ContextType = {
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

export const AppContext = createContext<ContextType>(initContext);

function App({ Component, pageProps }: AppProps) {
  const [userAcc, setUserAcc] = useState("");
  const [HPsigner, setHPsigner] = useState<HashConnectSigner>();
  const [hbarBal, setHbarBal] = useState("");
  const [tokenBal, setTokenBal] = useState(0);
  const [isMobileLink, setIsMobileLink] = useState(false);

  const router = useRouter();

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
        <h2>Mobili-C</h2>
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
                <div className="acc-balance">
                  <p>hbar balance:</p>
                  <p>{hbarBal}</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <button className="wallet-btn" onClick={() => router.push("/connect")}>
            Connect Wallet
          </button>
        )}

        <Component {...pageProps} />
      </AppContext.Provider>
    </div>
  );
}

export default App;
