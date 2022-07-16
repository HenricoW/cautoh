import React, { useState, useEffect, useContext, useRef } from "react";
import QRCode from "qrcode";
import QrScanner from "qr-scanner";
import { viewFinderSize } from "../utils/configs";
import { AppContext } from "./_app";
import Link from "next/link";

const LinkAccount = () => {
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [camOpen, setCamOpen] = useState(false);
  const [scanText, setScanText] = useState("Looking for Code...");
  const [isConnected, setIsConnected] = useState(false);

  const { userAcc, setUserAcc } = useContext(AppContext);

  const vidRef = useRef<HTMLVideoElement>(null);
  const scanRef = useRef<QrScanner>();

  useEffect(() => {
    const canv = document.getElementById("canvas");
    const vfinder = vidRef.current;

    const qrScanner = new QrScanner(
      vfinder!,
      (result) => {
        console.log("decoded qr code:", result.data);
        setUserAcc(result.data);
        onScanSuccess();
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
      }
    );
    scanRef.current = qrScanner;

    if (userAcc)
      QRCode.toCanvas(canv, userAcc)
        .then(() => showCode())
        .catch((err) => console.log(err));
  }, []);

  const showCode = () => {
    setCanvasVisible(true);
    setCamOpen(false);
  };

  const showScanner = () => {
    setCamOpen(true);
    scanRef.current?.start();
  };

  const closeScanner = () => {
    scanRef.current?.stop();
    setCamOpen(false);
  };

  const onScanSuccess = () => {
    closeScanner();
    setScanText("Success: Account linked");
  };

  return (
    <div className="acc-page">
      <canvas id="canvas" style={{ display: canvasVisible && !camOpen && isConnected ? "block" : "none" }}></canvas>
      <video id="viewfinder" width={viewFinderSize} height={camOpen ? viewFinderSize : "0px"} ref={vidRef}></video>

      {canvasVisible && !isConnected && !camOpen && (
        <>
          <h2>Please connect with your HashPack wallet</h2>
          <Link href="https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk">
            Install on Chrome or Brave
          </Link>
        </>
      )}

      {!camOpen && (
        <button className="config-btn" onClick={showCode}>
          On Computer: Show Code
        </button>
      )}

      {camOpen ? (
        <>
          <h4>{scanText}</h4>
          <button className="config-btn" onClick={closeScanner}>
            Close Scanner
          </button>
        </>
      ) : (
        <button className="config-btn" onClick={showScanner}>
          On Mobile: Scan Code
        </button>
      )}
    </div>
  );
};

export default LinkAccount;
