import type { AppProps } from "next/app";

import "../index.css";
import AppContext from "../contexts/AppContext";
import Header from "../components/Layout/Header";

function App({ Component, pageProps }: AppProps) {
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
