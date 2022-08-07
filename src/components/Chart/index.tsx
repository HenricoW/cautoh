import React from "react";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { SpeedDataType } from "../../types";
import styles from "./Chart.module.scss";

type ChartProps = {
  speedData: SpeedDataType[];
};

const Chart = ({ speedData }: ChartProps) => {
  return (
    <div>
      <div className={styles["chart-container"]}>
        <LineChart width={350} height={250} data={speedData}>
          <Line type="monotone" dataKey="speed" stroke="#ddd" />
          <CartesianGrid stroke="#bbb" strokeDasharray="5 5" />
          <XAxis
            label={{ value: "time (s)", stroke: "#ddd", angle: 0, position: "bottom" }}
            dataKey="time"
            height={45}
          />
          <YAxis label={{ value: "Vehicle Speed (m/s)", angle: -90, position: "insideLeft", stroke: "#ddd" }} />
        </LineChart>
      </div>
    </div>
  );
};

export default Chart;
