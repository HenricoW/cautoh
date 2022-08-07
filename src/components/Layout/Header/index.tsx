import React, { useContext } from "react";

import { AppCxt } from "../../../contexts/AppContext";
import useCopy from "../../../hooks/useCopy";
import RouteBtn from "../../Buttons/RouteBtn";

import styles from "./Header.module.scss";

const textToCopy = "0.0.47698769";

const Header = () => {
  const { userData, isMobileLink } = useContext(AppCxt);
  const { copyStatus, copyText } = useCopy();

  return (
    <div>
      <div className={styles.circle}></div>
      <h2>C-Auto</h2>
      <h4>Track your Carbon emissions from driving</h4>

      {userData.userAcc ? (
        <div className={styles["acc-summary"]}>
          <div className={styles["acc-id"]}>
            <p>Linked Account:</p>
            <p>{userData.userAcc}</p>
          </div>

          {!isMobileLink && (
            <>
              <div className={styles["cag-balance"]}>
                <p>CAG balance:</p>
                <p>{userData.tokenBal.toString()}</p>
              </div>
              <div className={styles["acc-balance"]} onClick={() => copyText(textToCopy)}>
                <p>tokenID:</p>
                <p>{textToCopy}</p>
                <p className={styles["copy-str"]}>{copyStatus}</p>
              </div>
              <div className={styles["acc-balance"]}>
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
