import type { ConfigData } from "../types";
import { baseURL, yearsPt, configsPt, makesPt, modelsPt } from "./configs";

export const getYears = async () => {
  console.log("Getting years");

  try {
    const resp = await fetch(baseURL + yearsPt);
    const data = await resp.json();

    console.log(data.years);
    return data.years as string[];
  } catch (error) {
    console.log("Error fetching years", error);

    return [] as string[];
  }
};

export const getMakes = async (year: number) => {
  if (year === 0) return [] as string[];
  console.log("Getting makes");

  try {
    const resp = await fetch(baseURL + makesPt, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year }),
    });
    const data = await resp.json();

    return data.makes as string[];
  } catch (error) {
    console.log("Error fetching makes", error);

    return [] as string[];
  }
};

export const getModels = async (year: number, make: string) => {
  if (make === "") return [] as string[];
  console.log("Getting models");

  try {
    const resp = await fetch(baseURL + modelsPt, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, make }),
    });
    const data = await resp.json();

    return data.models as string[];
  } catch (error) {
    console.log("Error fetching models", error);

    return [] as string[];
  }
};

export const getConfigs = async (year: number, make: string, model: string) => {
  if (model === "") return [] as ConfigData[];
  console.log("Getting configs");

  try {
    const resp = await fetch(baseURL + configsPt, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year, make, model }),
    });
    const data = await resp.json();

    return data.configData as ConfigData[];
  } catch (error) {
    console.log("Error fetching models", error);

    return [] as ConfigData[];
  }
};
