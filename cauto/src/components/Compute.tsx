import React, { useEffect, useState } from "react";
import { Fluence } from "@fluencelabs/fluence";
// import { krasnodar } from "@fluencelabs/fluence-network-environment";
import { get_emissions } from "../_aqua/emiss_getter";
import { useNavigate } from "react-router-dom";
import { intMS, SpeedDataType } from "../App";
import Chart from "./Chart";
import Controlls from "./Controlls";
import Distances from "./Distances";
import { ConfigData } from "./Options";
import "./Compute.css";

type ComputeProps = {
  currVehicle: ConfigData | null;
  setCurrVehicle: (value: React.SetStateAction<ConfigData | null>) => void;
  listenLoc: () => void;
  stopListenLoc: (isTesting: boolean) => void;
  distance: number;
  showHist: boolean;
  speedData: SpeedDataType[];
};

const Compute = (props: ComputeProps) => {
  const { distance, listenLoc, showHist, speedData, stopListenLoc, setCurrVehicle, currVehicle } = props;
  const navigate = useNavigate();
  const [emissResult, setemissResult] = useState(0);

  useEffect(() => {
    Fluence.start({
      connectTo: "/dns4/kras-05.fluence.dev/tcp/19001/wss/p2p/12D3KooWCMr9mU894i8JXAFqpgoFtx6qnV1LFPSfVc3Y34N4h4LS",
    }).catch((err) => console.log("Client initialization failed", err));

    const veh = localStorage.getItem("vehConfig");
    if (veh) setCurrVehicle(JSON.parse(veh));

    return () => {
      Fluence.stop().catch((err) => console.log("Error stopping client", err));
    };
  }, []);

  const onGetEmission = async () => {
    if (!Fluence.getStatus().isConnected) return;
    if (!currVehicle) return;

    const speeds = speedData.map((v) => v.speed);
    const result = await get_emissions(currVehicle.co2pm, speeds, intMS / 1000);
    console.log(result);
    setemissResult(result);
  };

  return (
    <>
      <button className="config-btn" onClick={() => navigate("/")}>
        Go Back
      </button>
      <Controlls listenLoc={listenLoc} stopListenLoc={stopListenLoc} />
      <Distances distance={distance} />
      {showHist && <Chart speedData={speedData} />}

      <button className="calc-btn" onClick={onGetEmission}>
        Calculate
      </button>
    </>
  );
};

export default Compute;
