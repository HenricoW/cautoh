import type { TravelDataType, UserDataType } from "../types";

export const shortenStr = (str: string, charCount: number) => {
  if (str.length <= charCount) return;

  return str.slice(0, charCount / 2) + " ... " + str.slice((-1 * charCount) / 2, str.length - 1);
};

export const dotsToDashes = (str: string) => str.replaceAll(".", "-");

export const fetchData = async (URL: string, hasData: boolean, reqData?: any) => {
  try {
    const resp = await fetch(
      URL,
      hasData
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reqData),
          }
        : {}
    );

    return await resp.json();
  } catch (error) {
    throw error;
  }
};

export const getBals = async (userAcc: string) => {
  return fetchData("api/getBalances", true, { accId: userAcc })
    .then((balInfo) => {
      return { hbar: balInfo.bal.hbarBalance as string, token: +balInfo.bal.balance / 1000 };
    })
    .catch((err) => {
      console.log(err);
      return { hbar: "", token: 0 };
    });
};

export const getDataToSave = (userData: UserDataType, travelData: TravelDataType) => ({
  accID: userData.userAcc,
  vehData: {
    modelConfig: travelData.currVehicle?.modelConfig,
    engineConfig: travelData.currVehicle?.engineConfig,
    fuel: travelData.currVehicle?.fuel,
    co2pm: travelData.currVehicle?.co2pm,
  },
  speedData: travelData.speedData,
});

export const pushDataReq = (dataToSave: any) => {
  return fetchData("api/pushData", true, dataToSave)
    .then((rdata) => {
      if (rdata.error) {
        console.log(rdata.message);
        return "Error saving data";
      } else {
        return "Data Saved!";
      }
    })
    .catch((err) => {
      console.log(err);
      return "Error saving data";
    });
};

export const calcEmissions = (travelData: TravelDataType) => {
  if (travelData.currVehicle && travelData.currVehicle.co2pm)
    return (travelData.currVehicle.co2pm * travelData.distance) / 1609;

  return 0;
};
