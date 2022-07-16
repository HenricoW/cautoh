import { HashConnectTypes } from "hashconnect";

export type LocationPoint = {
  lat: number;
  long: number;
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
