import React, { useMemo, useState } from "react";
import "./Options.css";

type ConfigData = {
  modelConfig: string;
  engineConfig: string;
  fuel: string;
  img: string;
  co2pm: number;
};

const baseURL = "https://cauto-api.vercel.app/api/";
const yearsPt = "years";
const makesPt = "makes";
const modelsPt = "models";
const configsPt = "modelConfigs";

const Options = () => {
  const [allYears, setAllYears] = useState<string[]>([]);
  const [allMakes, setAllMakes] = useState<string[]>([]);
  const [allModels, setAllModels] = useState<string[]>([]);
  const [allConfigs, setAllConfigs] = useState<ConfigData[]>([]);

  const [year, setYear] = useState(0);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [config, setConfig] = useState<ConfigData | {}>({});
  const [idxSelected, setIdxSelected] = useState(0);

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
    setIdxSelected(index);
    setConfig(allConfigs[index]);
  };

  return (
    <div>
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
        </>
      )}
    </div>
  );
};

export default React.memo(Options);
