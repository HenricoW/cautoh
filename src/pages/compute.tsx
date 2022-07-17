import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Chart from "../components/Chart";
import Controlls from "../components/Controlls";
import CurrentVehicle from "../components/CurrentVehicle";
import Distances from "../components/Distances";
import { getDist, getTestGraphData, graphData, processData } from "../utils/helpers";
import { ConfigData, LocationPoint, SpeedDataType } from "../utils/types";

const Compute = () => {
  const [isListening, setIsListening] = useState(false);
  const [locHist, setLocHist] = useState<LocationPoint[]>([]);
  const [dataCount, setDataCount] = useState(0);
  const [watchId, setWatchId] = useState<any>();
  const [showHist, setShowHist] = useState(false);
  const [speedData, setSpeedData] = useState<SpeedDataType[]>([]);
  const [distance, setDistance] = useState(0);
  const [emissResult, setemissResult] = useState(0);
  const [currVehicle, setCurrVehicle] = useState<ConfigData | null>(null);

  const router = useRouter();

  const listenLoc = () => {
    setShowHist(false);
    if ("geolocation" in navigator) {
      console.log("geoloc supported");

      setIsListening(true);
      // const wid = setInterval(getLoc, intMS);
      const wid = navigator.geolocation.watchPosition(
        (loc) => {
          let locPt = {
            acc: loc.coords.accuracy,
            speed: loc.coords.speed,
            ts: loc.timestamp,
          };

          setLocHist((hist) => [...hist, locPt]);
          setDataCount((c) => ++c);
        },
        (err) => console.log(err),
        { enableHighAccuracy: true }
      );

      setWatchId(wid);
    } else {
      console.log("geoloc NOT supported");
    }
  };

  const stopListenLoc = (isTesting: boolean) => {
    if (watchId === 0) return;

    // clearInterval(watchId);
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
  };

  return (
    <>
      <CurrentVehicle currVehicle={currVehicle} />
      <button className="config-btn" onClick={() => router.push("/")}>
        Go Back
      </button>
      <Controlls listenLoc={listenLoc} stopListenLoc={stopListenLoc} />
      <Distances distance={distance} />
      {showHist && <Chart speedData={speedData} />}

      <button className="config-btn" onClick={onGetEmission}>
        Calculate
      </button>

      <div className="result">
        <h2>{emissResult.toFixed(2)} grams of CO2</h2>
        <p>Within 15% level of accuracy</p>
      </div>
    </>
  );
};

export default Compute;
