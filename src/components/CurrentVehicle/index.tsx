import React from "react";

import type { ConfigData } from "../../types";

import styles from "./CurrentVehicle.module.scss";

interface CurrentVehicleProps {
  currVehicle: ConfigData | null;
}

const CurrentVehicle = ({ currVehicle }: CurrentVehicleProps) => {
  // console.log("[Rendering] current vehicle");
  return (
    <div>
      {currVehicle && (
        <>
          <h3>Your vehicle</h3>
          <div className={styles["selected-vehicle"]}>
            <h4>{currVehicle.modelConfig}</h4>
            <p>{currVehicle.engineConfig}</p>
            <p>{currVehicle.fuel}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(CurrentVehicle);
