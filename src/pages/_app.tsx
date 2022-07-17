import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { createContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import "../index.css";

interface ContextType {
  userAcc: string;
  setUserAcc: Dispatch<SetStateAction<string>>;
}

const initContext: ContextType = {
  userAcc: "",
  setUserAcc: (acc: SetStateAction<string>) => {},
};

export const AppContext = createContext<ContextType>(initContext);

function App({ Component, pageProps }: AppProps) {
  const [userAcc, setUserAcc] = useState("");

  const router = useRouter();

  return (
    <div className="app">
      <AppContext.Provider value={{ userAcc, setUserAcc }}>
        <div className="circle"></div>
        <h2>Mobili-C</h2>
        <h4>Track your Carbon emissions from driving</h4>

        {userAcc ? (
          <div className="acc-id">
            <p>Linked Account:</p>
            <p>{userAcc}</p>
          </div>
        ) : (
          <button className="config-btn" onClick={() => router.push("/connect")}>
            Connect Wallet
          </button>
        )}

        <Component {...pageProps} />
      </AppContext.Provider>
    </div>
  );
}

export default App;
