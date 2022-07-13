import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { SpeedDataType } from "../App";

type ChartProps = {
  speedData: SpeedDataType[];
};

const Chart = ({ speedData }: ChartProps) => {
  return (
    <div>
      <div style={{ margin: "3em auto" }}>
        <LineChart width={350} height={250} data={speedData}>
          <Line type="monotone" dataKey="speed" stroke="#ddd" />
          <CartesianGrid stroke="#bbb" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis label={{ value: "Vehicle Speed", angle: -90, position: "insideLeft", stroke: "#ddd" }} />
          {/* <YAxis /> */}
        </LineChart>
      </div>
    </div>
  );
};

export default Chart;
