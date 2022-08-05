import { HashConnectTypes } from "hashconnect";
import { HashConnectSigner } from "hashconnect/dist/provider/signer";
import { Dispatch, SetStateAction } from "react";

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

export interface AppContextType {
  userAcc: string;
  setUserAcc: Dispatch<SetStateAction<string>>;
  HPsigner: HashConnectSigner | undefined;
  setHPsigner: Dispatch<SetStateAction<HashConnectSigner | undefined>>;
  hbarBal: string;
  setHbarBal: Dispatch<SetStateAction<string>>;
  tokenBal: number;
  setTokenBal: Dispatch<SetStateAction<number>>;
  setIsMobileLink: Dispatch<SetStateAction<boolean>>;
}
