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
