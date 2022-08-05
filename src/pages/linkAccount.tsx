import React, { useState, useEffect, useContext, useRef } from "react";
import QRCode from "qrcode";
import QrScanner from "qr-scanner";
import BaseBtn from "../components/Buttons/BaseBtn";
import { viewFinderSize } from "../utils/configs";
import { AppContext } from "./_app";
import Link from "next/link";

const LinkAccount = () => {
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [camOpen, setCamOpen] = useState(false);
  const [scanText, setScanText] = useState("Looking for Code...");
  const [isConnected, setIsConnected] = useState(false);

  const { userAcc, setUserAcc, setIsMobileLink } = useContext(AppContext);

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
        setIsMobileLink(true);
        onScanSuccess();
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
      }
    );
    scanRef.current = qrScanner;

    console.log("connected account:", userAcc);
    if (userAcc) {
      QRCode.toCanvas(canv, userAcc).catch((err) => console.log(err));
    }
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
      <canvas id="canvas" style={{ display: canvasVisible && !camOpen && userAcc ? "block" : "none" }}></canvas>
      <video id="viewfinder" width={viewFinderSize} height={camOpen ? viewFinderSize : "0px"} ref={vidRef}></video>

      {canvasVisible && !userAcc && !camOpen && (
        <>
          <h2>Please connect with your HashPack wallet</h2>
          <div id="ext-link">
            <Link href="https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk">
              Install on Chrome or Brave
            </Link>
          </div>
        </>
      )}

      {!camOpen && <BaseBtn onClick={showCode}>On Computer: Show Code</BaseBtn>}

      {camOpen ? (
        <>
          <h4>{scanText}</h4>
          <BaseBtn onClick={closeScanner}>Close Scanner</BaseBtn>
        </>
      ) : (
        <BaseBtn onClick={showScanner}>On Mobile: Scan Code</BaseBtn>
      )}
    </div>
  );
};

export default LinkAccount;
