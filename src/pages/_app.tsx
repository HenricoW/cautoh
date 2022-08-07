import type { AppProps } from "next/app";

import "../styles/index.scss";
import "./compute/compute.scss";
import AppContext from "../contexts/AppContext";
import Header from "../components/Layout/Header";

function App({ Component, pageProps }: AppProps) {
  // console.log("[Rendering] _app");
  return (
    <div className="app">
      <AppContext>
        <Header />
        <Component {...pageProps} />
      </AppContext>
    </div>
  );
}

export default App;
