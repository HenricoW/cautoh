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

export type UserDataType = {
  userAcc: string;
  hbarBal: string;
  tokenBal: number;
};

export type AppCtxType = {
  userData: UserDataType;
  setUserData: Dispatch<SetStateAction<UserDataType>>;
  HPsigner: HashConnectSigner | null;
  setHPsigner: Dispatch<SetStateAction<HashConnectSigner | null>>;
  isMobileLink: boolean;
  setIsMobileLink: Dispatch<SetStateAction<boolean>>;
};
