import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";

import QRCode from "qrcode";
import QrScanner from "qr-scanner";

import BaseBtn from "../../components/Buttons/Button";

import { viewFinderSize } from "../../utils/configs";
import { AppCxt } from "../../contexts/AppContext";

import styles from "./linkAccount.module.scss";

const LinkAccount = () => {
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [camOpen, setCamOpen] = useState(false);
  const [scanText, setScanText] = useState("Looking for Code...");

  const { userData, setUserData, setIsMobileLink } = useContext(AppCxt);

  const vidRef = useRef<HTMLVideoElement>(null);
  const scanRef = useRef<QrScanner>();

  useEffect(() => {
    const canv = document.getElementById("canvas");
    const vfinder = vidRef.current;

    const qrScanner = new QrScanner(
      vfinder!,
      (result) => {
        console.log("decoded qr code:", result.data);
        setUserData((usrData) => ({ ...usrData, userAcc: result.data }));
        setIsMobileLink(true);
        onScanSuccess();
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
      }
    );
    scanRef.current = qrScanner;

    console.log("connected account:", userData.userAcc);
    if (userData.userAcc) {
      QRCode.toCanvas(canv, userData.userAcc).catch((err) => console.log(err));
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
    <div className={styles["acc-page"]}>
      {/* QR display */}
      <canvas
        id="canvas"
        className={canvasVisible && !camOpen && userData.userAcc ? styles.show : styles.hide}
      ></canvas>

      {/* Scanner view */}
      <video id="viewfinder" width={viewFinderSize} height={camOpen ? viewFinderSize : "0px"} ref={vidRef}></video>

      {canvasVisible && !userData.userAcc && !camOpen && (
        <>
          <h2>Please connect with your HashPack wallet</h2>
          <div className={styles["ext-link"]}>
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
