import React from "react";

interface BaseBtnProps {
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  children: React.ReactNode;
}

const BaseBtn = ({ disabled = false, onClick, children }: BaseBtnProps) => {
  return (
    <button className="config-btn" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default BaseBtn;
