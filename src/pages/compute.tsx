import { useContext, useEffect, useState } from "react";

import CurrentVehicle from "../components/CurrentVehicle";
import Chart from "../components/Chart";
import BaseBtn from "../components/Buttons/BaseBtn";

import { AppCxt } from "../contexts/AppContext";
import { getBals, getDist, getTestGraphData, graphData, processData } from "../utils/helpers";
import type { ConfigData, LocationPoint, SpeedDataType } from "../types";
import { fetchData } from "../utils/helpers";

const Compute = () => {
  const [isListening, setIsListening] = useState(false);
  const [locHist, setLocHist] = useState<LocationPoint[]>([]);
  const [watchId, setWatchId] = useState<any>();
  const [showHist, setShowHist] = useState(false);
  const [speedData, setSpeedData] = useState<SpeedDataType[]>([]);
  const [distance, setDistance] = useState(0);
  const [emissResult, setemissResult] = useState(0);
  const [currVehicle, setCurrVehicle] = useState<ConfigData | null>(null);
  const [respMssg, setRespMssg] = useState("");

  const { userData, setUserData } = useContext(AppCxt);

  const listenLoc = () => {
    setShowHist(false);
    if ("geolocation" in navigator) {
      console.log("geoloc supported");

      setIsListening(true);
      const wid = navigator.geolocation.watchPosition(
        (loc) => {
          let locPt = {
            acc: loc.coords.accuracy,
            speed: loc.coords.speed,
            ts: loc.timestamp,
          };

          setLocHist((hist) => [...hist, locPt]);
        },
        (err) => console.log(err),
        { enableHighAccuracy: true }
      );

      setWatchId(wid);
      setRespMssg("");
    } else {
      console.log("geoloc NOT supported");
    }
  };

  const stopListenLoc = (isTesting: boolean) => {
    if (watchId === 0) return;

    navigator.geolocation.clearWatch(watchId);

    // getGraphData(isTesting);
    const pData = processData(locHist);
    const gData = isTesting ? getTestGraphData() : graphData(pData);

    setSpeedData(gData);
    setDistance(getDist(gData));
    setIsListening(false);
    setWatchId(0);
    setShowHist(true);
  };

  useEffect(() => {
    const veh = localStorage.getItem("vehConfig");
    if (veh) setCurrVehicle(JSON.parse(veh));
  }, []);

  const onGetEmission = async () => {
    if (!currVehicle) return;

    const emm = (currVehicle.co2pm * distance) / 1609;
    setemissResult(emm);

    const dataToSave = {
      accID: userData.userAcc,
      vehData: {
        modelConfig: currVehicle.modelConfig,
        engineConfig: currVehicle.engineConfig,
        fuel: currVehicle.fuel,
        co2pm: currVehicle.co2pm,
      },
      speedData,
    };

    fetchData("api/pushData", true, dataToSave)
      .then((rdata) => {
        if (rdata.error) {
          setRespMssg("Error saving data");
          console.log(rdata.message);
        } else {
          setRespMssg("Data Saved!");
        }
      })
      .catch((err) => {
        setRespMssg("Error saving data");
        console.log(err);
      });

    fetchData("api/mintCOOtkn", true, { amount: emm, receiver: userData.userAcc })
      .then((rdata) => {
        console.log("post mint", rdata);
        return updateBals();
      })
      .then((tkbal) => console.log(tkbal))
      .catch((err) => console.log(err));
  };

  const updateBals = async () => {
    const { hbar, token } = await getBals(userData.userAcc);
    console.log(hbar, token);
    setUserData((usrData) => ({ ...usrData, hbarBal: hbar, tokenBal: token }));

    return token;
  };

  const toggleRec = () => (isListening ? stopListenLoc(false) : listenLoc());

  return (
    <>
      <CurrentVehicle currVehicle={currVehicle} />
      <div className="ctrlgroup">
        <div className={"start-stop-btn" + (isListening ? " rec" : "")} onClick={toggleRec}>
          {isListening ? "Pause" : "Start"}
        </div>
      </div>
      <h3>
        Distance: {(distance / 1000).toFixed(3)} km / {(distance / 1609).toFixed(3)} mi
      </h3>
      {showHist && <Chart speedData={speedData} />}

      <BaseBtn disabled={!userData.userAcc || isListening} onClick={onGetEmission}>
        {userData.userAcc ? "Calculate" : "Connect to Calculate"}
      </BaseBtn>

      <div className="result">
        <p>{respMssg}</p>
        <h2>{emissResult.toFixed(2)} grams of CO2</h2>
      </div>
    </>
  );
};

export default Compute;
