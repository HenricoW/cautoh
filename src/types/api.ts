import { SpeedDataType } from ".";

export type apiVehData = {
  modelConfig: string;
  engineConfig: string;
  fuel: string;
  co2pm: number;
};

export type apiPushData = {
  accID: string;
  vehData: apiVehData;
  speedData: SpeedDataType[];
};

export type PushDataResponse = {
  error: boolean;
  message: string;
};

export type PullDataResponse = PushDataResponse & {
  data: string;
};
