import { LocationPoint, SpeedDataType } from "./types";

export const shortenStr = (str: string, charCount: number) => {
  if (str.length <= charCount) return;

  return str.slice(0, charCount / 2) + " ... " + str.slice((-1 * charCount) / 2, str.length - 1);
};

export const dotsToDashes = (str: string) => str.replaceAll(".", "-");

export const processData = (locHist: LocationPoint[]) => {
  return locHist.map((pt) => ({ time: pt.ts, speed: pt.speed || 0 }));
};

export const graphData = (data: SpeedDataType[]) => {
  const secsData = data.map((o, i, data) => ({ ...o, time: (o.time - data[0].time) / 1000 }));

  const leapCount = Math.floor(secsData.length / 20);
  return leapCount < 1
    ? secsData
    : secsData.reduce((acc, v, i) => {
        if (i % leapCount !== 0) return acc;
        return [...acc, v];
      }, [] as SpeedDataType[]);
};

export const getTestGraphData = () => {
  let data: SpeedDataType[] = [];
  for (let i = 0; i < 10; i++) data.push({ time: i * 0.5, speed: 15 + Math.floor(Math.random() * 10) });

  return data;
};

export const getDist = (sData: SpeedDataType[]) => {
  let dist = 0;
  for (let i = 1; i < sData.length; i++) {
    dist += ((sData[i].speed + sData[i - 1].speed) / 2) * (sData[i].time - sData[i - 1].time);
  }

  return dist;
};
