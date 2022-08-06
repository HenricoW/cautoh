import type { ConfigData } from "../types";
import type { NameTypes, VehReqData } from "../types/api";
import { baseURL, yearsPt, makesPt, modelsPt, configsPt } from "./configs";
import { fetchData } from "./helpers";

const fetchVehDataGen = async (name: NameTypes, endPoint: string, hasData: boolean, reqData?: VehReqData) => {
  console.log("Getting", name);
  try {
    const data = await fetchData(baseURL + endPoint, hasData, reqData);

    return data[name] as string[];
  } catch (error) {
    console.log("Error fetching", name, error);

    return [] as string[];
  }
};

export const getYears = async () => {
  return await fetchVehDataGen("years", yearsPt, false);
};

export const getMakes = async (year: number) => {
  if (year === 0) return [] as string[];

  return await fetchVehDataGen("makes", makesPt, true, { year });
};

export const getModels = async (year: number, make: string) => {
  if (make === "") return [] as string[];

  return await fetchVehDataGen("models", modelsPt, true, { year, make });
};

export const getConfigs = async (year: number, make: string, model: string) => {
  if (model === "") return [] as ConfigData[];

  console.log("Getting configs");
  try {
    const data = await fetchData(baseURL + configsPt, true, { year, make, model });

    return data.configData as ConfigData[];
  } catch (error) {
    console.log("Error fetching configData", error);

    return [] as ConfigData[];
  }
};
