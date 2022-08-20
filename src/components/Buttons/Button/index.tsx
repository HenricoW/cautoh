import React from "react";

import styles from "./Button.module.scss";

interface BaseBtnProps {
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  children: React.ReactNode;
}

const BaseBtn = ({ disabled = false, onClick, children }: BaseBtnProps) => {
  // console.log("[Rendering] button:", children);
  return (
    <button className={styles["config-btn"]} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default React.memo(BaseBtn);
