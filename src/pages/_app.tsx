import type { AppProps } from "next/app";
import "../index.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <div className="app">
      <div className="circle"></div>
      <h2>Mobili-C</h2>
      <h4>Track your Carbon emissions from driving</h4>

      <Component {...pageProps} />
    </div>
  );
}

export default App;
