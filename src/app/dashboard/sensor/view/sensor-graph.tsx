"use client";

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from "recharts";

type SensorData = { timestamp: Date; value: number }[];

export default function SensorGraph(props: {
  data: { sensorName: string; values: SensorData }[],
  width?: number | string,
  height?: number | string,
}) {
  return (
    <ResponsiveContainer width={props.width ?? "100%"} height={props.height ?? 400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" domain={["dataMin", "dataMax"]} scale="time"
          dataKey={(v) => v.timestamp.valueOf()}
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleString()}
        />
        <YAxis type="number" domain={["dataMin", "dataMax"]} dataKey="value" />
        <ZAxis type="number" range={[100]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        {props.data.map((v, i) => (
          <Scatter name={v.sensorName} data={v.values} key={i} fill="#000000" line />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
