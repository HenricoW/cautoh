import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import BaseBtn from "../components/Buttons/BaseBtn";
import RouteBtn from "../components/Buttons/RouteBtn";
import CurrentVehicle from "../components/CurrentVehicle";
import RenderVehicleOptions from "../components/RenderVehicleOptions";
import type { ConfigData } from "../types";
import { getConfigs, getMakes, getModels, getYears } from "../utils/vehicle";

const Home: NextPage = () => {
  const [allYears, setAllYears] = useState<string[]>([]);
  const [allMakes, setAllMakes] = useState<string[]>([]);
  const [allModels, setAllModels] = useState<string[]>([]);
  const [allConfigs, setAllConfigs] = useState<ConfigData[]>([]);

  const [year, setYear] = useState(0);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [idxSelected, setIdxSelected] = useState(0);

  const [currVehicle, setCurrVehicle] = useState<ConfigData | null>(null);

  useEffect(() => {
    const veh = localStorage.getItem("vehConfig");
    if (veh) setCurrVehicle(JSON.parse(veh));

    getYears().then((years) => setAllYears(years));
  }, []);

  useEffect(() => {
    getMakes(year).then((makes) => setAllMakes(makes));
  }, [year]);

  useEffect(() => {
    getModels(year, make).then((models) => setAllModels(models));
  }, [make]);

  useEffect(() => {
    getConfigs(year, make, model).then((configs) => setAllConfigs(configs));
  }, [model]);

  const onSelectFinish = () => {
    console.log(allConfigs[idxSelected]);
    localStorage.setItem("vehConfig", JSON.stringify(allConfigs[idxSelected]));
    router.push("compute");
  };

  const router = useRouter();
  return (
    <>
      <RouteBtn text="Link with Mobile" route="linkAccount" />

      <section className="vehicle-selection">
        <CurrentVehicle currVehicle={currVehicle} />

        <h3>What vehicle do you drive?</h3>
        <RenderVehicleOptions name="Year" arrayData={allYears} setterNum={setYear} />

        {allMakes.length > 1 && <RenderVehicleOptions name="Make" arrayData={allMakes} setterStr={setMake} />}

        {allModels.length > 1 && <RenderVehicleOptions name="Model" arrayData={allModels} setterStr={setModel} />}

        {allConfigs.length > 1 && (
          <>
            <h3>Select your configuration</h3>
            {allConfigs.map((cf, index) => (
              <div
                className={`${index === idxSelected ? " selected" : "configs"}`}
                key={cf.modelConfig + cf.engineConfig}
                onClick={() => setIdxSelected(() => index)}
              >
                <h4>{cf.modelConfig}</h4>
                <p>{cf.engineConfig}</p>
                <p>{cf.fuel}</p>
              </div>
            ))}

            <BaseBtn onClick={onSelectFinish}>DONE</BaseBtn>
          </>
        )}
      </section>

      {!model && <RouteBtn text="Track Emissions Now" route="compute" />}
    </>
  );
};

export default Home;
