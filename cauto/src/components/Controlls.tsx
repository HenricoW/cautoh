import React from "react";

type ControllsProps = {
  listenLoc: () => void;
  stopListenLoc: (isTesting: boolean) => void;
};

const Controlls = ({ listenLoc, stopListenLoc }: ControllsProps) => {
  return (
    <>
      <div className="circle-btn" onClick={listenLoc}>
        <h4>START</h4>
      </div>

      <div className="stopgrp" style={{ display: "flex" }}>
        <div className="circle-btn" onClick={() => stopListenLoc(true)}>
          <h4>STOP</h4>
        </div>
        <div className="circle-btn" onClick={() => stopListenLoc(false)}>
          <h4>STOP-V</h4>
        </div>
      </div>
    </>
  );
};

export default Controlls;
