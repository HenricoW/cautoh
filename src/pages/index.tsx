import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import CurrentVehicle from "../components/CurrentVehicle";
import { baseURL, configsPt, makesPt, modelsPt, yearsPt } from "../utils/configs";
import { ConfigData } from "../utils/types";
import { AppContext } from "./_app";

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

  const { userAcc } = useContext(AppContext);
  const router = useRouter();

  const fetchYears = useMemo(() => {
    console.log("Getting years");
    return fetch(baseURL + yearsPt)
      .then((resp) => resp.json())
      .then((res) => setAllYears(res.years as string[]))
      .catch((err) => {
        console.log(err);
        return ["0"];
      });
  }, []);

  const fetchMakes = useMemo(() => {
    if (year === 0) return;
    console.log("Getting makes");
    return fetch(baseURL + makesPt, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year }),
    })
      .then((resp) => resp.json())
      .then((res) => setAllMakes(res.makes as string[]))
      .catch((err) => console.log(err));
  }, [year]);

  const fetchModels = useMemo(() => {
    if (make === "") return;
    console.log("Getting models");
    return fetch(baseURL + modelsPt, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, make }),
    })
      .then((resp) => resp.json())
      .then((res) => setAllModels(res.models as string[]))
      .catch((err) => console.log(err));
  }, [make]);

  const fetchConfigs = useMemo(() => {
    if (make === "") return;
    console.log("Getting configs");
    return fetch(baseURL + configsPt, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, make, model }),
    })
      .then((resp) => resp.json())
      .then((res) => {
        console.log(res.configData);
        setAllConfigs(res.configData as ConfigData[]);
      })
      .catch((err) => console.log(err));
  }, [model]);

  // console.log("rendering");

  const onYearUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setYear(+e.target.value);
  };

  const onMakeUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setMake(e.target.value);
  };

  const onModelUpdate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setModel(e.target.value);
  };

  const onConfigUpdate = (index: number) => {
    console.log(index);
    setIdxSelected((oldi) => index);
  };

  const onSelectFinish = () => {
    console.log(allConfigs[idxSelected]);
    localStorage.setItem("vehConfig", JSON.stringify(allConfigs[idxSelected]));
    router.push("compute");
  };

  useEffect(() => {
    const veh = localStorage.getItem("vehConfig");
    if (veh) setCurrVehicle(JSON.parse(veh));
  }, []);

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
                onClick={() => onConfigUpdate(index)}
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

// export default React.memo(Home);
export default Home;
