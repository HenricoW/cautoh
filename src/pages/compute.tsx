import { useContext, useEffect, useState } from "react";

import CurrentVehicle from "../components/CurrentVehicle";
import Chart from "../components/Chart";
import BaseBtn from "../components/Buttons/BaseBtn";

import { AppCxt } from "../contexts/AppContext";
import { getBals, getDist, getTestGraphData, graphData, processData } from "../utils/helpers";
import type { ListenDataType, TravelDataType, ViewDataType } from "../types";
import { fetchData } from "../utils/helpers";

const Compute = () => {
  const [listenData, setListenData] = useState<ListenDataType>({ isListening: false, watchId: 0 });
  const [travelData, setTravelData] = useState<TravelDataType>({
    currVehicle: null,
    locHist: [],
    speedData: [],
    distance: 0,
    emissResult: 0,
  });
  const [viewData, setViewData] = useState<ViewDataType>({ showHist: false, respMssg: "" });

  const { userData, setUserData } = useContext(AppCxt);

  const listenLoc = () => {
    setViewData((data) => ({ ...data, showHist: false }));
    if ("geolocation" in navigator) {
      console.log("geoloc supported");

      setListenData((data) => ({ ...data, isListening: true }));
      const wid = navigator.geolocation.watchPosition(
        (loc) => {
          let locPt = {
            acc: loc.coords.accuracy,
            speed: loc.coords.speed,
            ts: loc.timestamp,
          };

          setTravelData((data) => ({ ...data, locHist: [...data.locHist, locPt] }));
        },
        (err) => console.log(err),
        { enableHighAccuracy: true }
      );

      setListenData((data) => ({ ...data, watchId: wid }));
      setViewData((data) => ({ ...data, respMssg: "" }));
    } else {
      console.log("geoloc NOT supported");
    }
  };

  const stopListenLoc = (isTesting: boolean) => {
    if (listenData.watchId === 0) return;

    navigator.geolocation.clearWatch(listenData.watchId);

    // getGraphData(isTesting);
    const pData = processData(travelData.locHist);
    const gData = isTesting ? getTestGraphData() : graphData(pData);

    setTravelData((data) => ({ ...data, speedData: gData, distance: getDist(gData) }));
    setListenData({ isListening: false, watchId: 0 });
    setViewData((data) => ({ ...data, showHist: true }));
  };

  useEffect(() => {
    const veh = localStorage.getItem("vehConfig");
    if (veh) setTravelData((data) => ({ ...data, currVehicle: JSON.parse(veh) }));
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

  const toggleRec = () => (listenData.isListening ? stopListenLoc(false) : listenLoc());

  return (
    <>
      <CurrentVehicle currVehicle={travelData.currVehicle} />
      <div className="ctrlgroup">
        <div className={"start-stop-btn" + (listenData.isListening ? " rec" : "")} onClick={toggleRec}>
          {listenData.isListening ? "Pause" : "Start"}
        </div>
      </div>
      <h3>
        Distance: {(travelData.distance / 1000).toFixed(3)} km / {(travelData.distance / 1609).toFixed(3)} mi
      </h3>
      {viewData.showHist && <Chart speedData={travelData.speedData} />}

      <BaseBtn disabled={!userData.userAcc || listenData.isListening} onClick={onGetEmission}>
        {userData.userAcc ? "Calculate" : "Connect to Calculate"}
      </BaseBtn>

      <div className="result">
        <p>{viewData.respMssg}</p>
        <h2>{travelData.emissResult.toFixed(2)} grams of CO2</h2>
      </div>
    </>
  );
};

export default Compute;
