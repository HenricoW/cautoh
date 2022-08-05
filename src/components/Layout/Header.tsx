import React, { useContext, useState } from "react";

import { AppCxt } from "../../contexts/AppContext";
import RouteBtn from "../Buttons/RouteBtn";

export type CopyMssg = "Click to copy" | "Copied!" | "Please try again";
const textToCopy = "0.0.47698769";

const Header = () => {
  // TODO: extract to useCopy
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

  const { userData, isMobileLink } = useContext(AppCxt);

  return (
    <div>
      <div className="circle"></div>
      <h2>C-Auto</h2>
      <h4>Track your Carbon emissions from driving</h4>

      {userData.userAcc ? (
        <div className="acc-summary">
          <div className="acc-id">
            <p>Linked Account:</p>
            <p>{userData.userAcc}</p>
          </div>

          {!isMobileLink && (
            <>
              <div className="cag-balance">
                <p>CAG balance:</p>
                <p>{userData.tokenBal.toString()}</p>
              </div>
              <div className="acc-balance" onClick={() => copyText(textToCopy)}>
                <p>tokenID:</p>
                <p>{textToCopy}</p>
                <p>{copyStatus}</p>
              </div>
              <div className="acc-balance">
                <p>hbar balance:</p>
                <p>{userData.hbarBal}</p>
              </div>
            </>
          )}
        </div>
      ) : (
        <RouteBtn text="Connect Wallet" route="connect" />
      )}
    </div>
  );
};

export default Header;
