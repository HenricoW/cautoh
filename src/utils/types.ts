import { HashConnectTypes } from "hashconnect";

export type LocationPoint = {
  acc: number;
  speed: number | null;
  ts: number;
};

export type ConfigData = {
  modelConfig: string;
  engineConfig: string;
  fuel: string;
  img: string;
  co2pm: number;
};

export type SpeedDataType = {
  time: number;
  speed: number;
};

export type HCSaveData = {
  topic: string;
  pairingString: string;
  privateKey?: string;
  pairedWalletData?: HashConnectTypes.WalletMetadata;
  pairedAccounts: string[];
};

// --------- API ---------
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
