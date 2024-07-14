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
  data: { sensorName: string; readings: SensorData }[],
  width?: number | string,
  height?: number | string,
}) {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#d8c4b3",
    "#82ca9d",
  ];

  function formatTime(unixTime: number): string {
    return new Date(unixTime).toLocaleTimeString();
  }

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
          tickFormatter={formatTime}
        />
        <YAxis type="number" domain={["dataMin", "dataMax"]} dataKey="value" />
        <ZAxis type="number" range={[100]} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value, name) => (
            // if `name` is not 'value' then this is the timestamp
            name !== "value" ? formatTime(value as number) : value
          )}
        />
        <Legend />
        {props.data.map((v, i) => (
          <Scatter name={v.sensorName} data={v.readings} key={i} fill={colors[i]} line />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
