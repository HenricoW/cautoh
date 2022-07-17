import React from "react";
import { ConfigData } from "../utils/types";

interface CurrentVehicleProps {
  currVehicle: ConfigData | null;
}

const CurrentVehicle = ({ currVehicle }: CurrentVehicleProps) => {
  return (
    <div>
      {currVehicle && (
        <>
          <h3>Your vehicle</h3>
          <div className="configs">
            <h4>{currVehicle.modelConfig}</h4>
            <p>{currVehicle.engineConfig}</p>
            <p>{currVehicle.fuel}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrentVehicle;
