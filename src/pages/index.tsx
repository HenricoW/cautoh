import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import CurrentVehicle from "../components/CurrentVehicle";
import { baseURL, configsPt, makesPt, modelsPt, yearsPt } from "../utils/configs";
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
      <button className="wallet-btn" onClick={() => router.push("/linkAccount")}>
        Link with Mobile
      </button>

      <section className="vehicle-selection">
        <CurrentVehicle currVehicle={currVehicle} />
        <h3>What vehicle do you drive?</h3>
        <select name="years" id="years" onChange={(e) => onYearUpdate(e)}>
          <option value="">Year</option>
          {allYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {allMakes.length > 1 && (
          <select name="makes" id="makes" onChange={(e) => onMakeUpdate(e)}>
            <option value="">Make</option>
            {allMakes.map((mk) => (
              <option key={mk} value={mk}>
                {mk}
              </option>
            ))}
          </select>
        )}

        {allModels.length > 1 && (
          <select name="models" id="models" onChange={(e) => onModelUpdate(e)}>
            <option value="">Model</option>
            {allModels.map((md) => (
              <option key={md} value={md}>
                {md}
              </option>
            ))}
          </select>
        )}

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

            <button className="config-btn" onClick={onSelectFinish}>
              DONE
            </button>
          </>
        )}
      </section>

      {!model && (
        <button className="config-btn" onClick={() => router.push("compute")}>
          Track Emissions Now
        </button>
      )}
    </>
  );
};

export default Home;
