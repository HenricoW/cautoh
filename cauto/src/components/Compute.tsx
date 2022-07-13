import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SpeedDataType } from "../App";
import Chart from "./Chart";
import Controlls from "./Controlls";
import Distances from "./Distances";
import { ConfigData } from "./Options";

type ComputeProps = {
  setCurrVehicle: (value: React.SetStateAction<ConfigData | null>) => void;
  listenLoc: () => void;
  stopListenLoc: (isTesting: boolean) => void;
  onGetConfigs: () => Promise<void>;
  distance: number;
  showHist: boolean;
  speedData: SpeedDataType[];
};

const Compute = (props: ComputeProps) => {
  const { distance, listenLoc, onGetConfigs, showHist, speedData, stopListenLoc, setCurrVehicle } = props;

  const navigate = useNavigate();

  useEffect(() => {
    const veh = localStorage.getItem("vehConfig");

    if (veh) {
      setCurrVehicle(JSON.parse(veh));
    }
  }, []);

  return (
    <>
      <button className="config-btn" onClick={() => navigate("/")}>
        Go Back
      </button>
      <Controlls listenLoc={listenLoc} stopListenLoc={stopListenLoc} />
      <Distances distance={distance} />
      {showHist && <Chart speedData={speedData} />}

      <button onClick={onGetConfigs}>Get Model Configs</button>
    </>
  );
};

export default Compute;
