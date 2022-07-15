import React, { useEffect, useState } from "react";
import "./App.css";
import { LocationPoint } from "./utils/types";
import Options, { ConfigData } from "./components/Options";
import { Route, Routes } from "react-router-dom";
import Compute from "./components/Compute";

export const intMS = 500;
export type SpeedDataType = {
  time: number;
  speed: number;
};

function App() {
  const [isListening, setIsListening] = useState(false);
  const [locHist, setLocHist] = useState<LocationPoint[]>([]);
  const [dataCount, setDataCount] = useState(0);
  const [watchId, setWatchId] = useState<any>();
  const [showHist, setShowHist] = useState(false);
  const [speedData, setSpeedData] = useState<SpeedDataType[]>([]);
  const [distance, setDistance] = useState(0);
  const [currVehicle, setCurrVehicle] = useState<ConfigData | null>(null);

  // const getLoc = () =>
  //   navigator.geolocation.getCurrentPosition(
  //     (loc) => {
  //       let locPt = {
  //         lat: loc.coords.latitude,
  //         long: loc.coords.longitude,
  //         acc: loc.coords.accuracy,
  //         speed: loc.coords.speed,
  //         ts: loc.timestamp,
  //       };
  //       console.log("lat long:", locPt.lat, locPt.long, dataCount);

  //       setLocHist((hist) => [...hist, locPt]);
  //       setDataCount((c) => ++c);
  //     },
  //     (err) => console.log(err),
  //     { enableHighAccuracy: true }
  //   );

  const listenLoc = () => {
    setShowHist(false);
    if ("geolocation" in navigator) {
      console.log("geoloc supported");

      setIsListening(true);
      // const wid = setInterval(getLoc, intMS);
      const wid = navigator.geolocation.watchPosition(
        (loc) => {
          let locPt = {
            lat: loc.coords.latitude,
            long: loc.coords.longitude,
            acc: loc.coords.accuracy,
            speed: loc.coords.speed,
            ts: loc.timestamp,
          };
          console.log("lat long:", locPt.lat, locPt.long, dataCount);

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
    getGraphData(isTesting);
    setIsListening(false);
    setWatchId(0);
    setShowHist(true);
  };

  const getSpeeds = () => {
    return new Promise<number[]>((res, rej) => {
      if (locHist.length < 1) rej("No location history");

      const spds = locHist.map((v) => v.speed || 0);
      res(spds);
    });
  };

  const getGraphData = async (isTesting: boolean) => {
    let lSpeeds: number[];
    const hSpeeds = await getSpeeds();

    lSpeeds = isTesting
      ? hSpeeds.map(() => {
          let sp = Math.floor(Math.random() * 20);
          return sp;
        })
      : hSpeeds;

    const leapCount = Math.floor(lSpeeds.length / 20);
    const sData =
      leapCount < 1
        ? lSpeeds.map((v, i) => ({ time: i * 0.5, speed: v }))
        : lSpeeds
            .reduce((acc, v, i) => {
              if (i % leapCount !== 0) return acc;
              return [...acc, v];
            }, [] as number[])
            .map((v, i) => ({ time: i * 0.5 * leapCount, speed: v }));
    setSpeedData(sData);

    const distance = getDistance(lSpeeds);

    console.log(sData);
    console.log(distance / 1000, " km");
    console.log(lSpeeds);
  };

  const getDistance = (speeds: number[]) => {
    let dist = 0;
    for (let i = 1; i < speeds.length; i++) {
      let a = speeds[i - 1];
      let b = speeds[i];
      dist += (intMS * (a + b)) / (2 * 1000);
    }

    setDistance(dist);
    return dist;
  };

  useEffect(() => {
    const veh = localStorage.getItem("vehConfig");
    if (veh) setCurrVehicle((prev) => JSON.parse(veh));
  }, []);

  return (
    <div className="App">
      <div className="circle"></div>
      <h2>Mobili-C</h2>
      <h4>Track your Carbon emissions from driving</h4>

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

      <Routes>
        <Route path="/" element={<Options />} />
        <Route
          path="compute"
          element={
            <Compute
              distance={distance}
              listenLoc={listenLoc}
              currVehicle={currVehicle}
              setCurrVehicle={setCurrVehicle}
              showHist={showHist}
              speedData={speedData}
              stopListenLoc={stopListenLoc}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
