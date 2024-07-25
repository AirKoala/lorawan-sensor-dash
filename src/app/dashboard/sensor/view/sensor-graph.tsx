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
import { AxisDomain } from "recharts/types/util/types";

type SensorData = { timestamp: Date; value: number }[];

export default function SensorGraph(props: {
  data: { sensorName: string; readings: SensorData }[],
  width?: number | string,
  height?: number | string,
  xDomain: [string, string] | [number, number],
  yDomain: [string, string] | [number, number],
  unit?: string,
}) {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#d8c4b3",
    "#82ca9d",
  ];

  function formatDateTime(unixTime: number): string {
    return new Date(unixTime).toLocaleString();
  }

  function formatTime(unixTime: number): string {
    return new Date(unixTime).toLocaleTimeString();
  }

  const filteredData: { sensorName: string; readings: SensorData }[] = [];

  props.data.forEach((sensor) => {
    const filteredSensor = { sensorName: sensor.sensorName, readings: [] as SensorData };
    sensor.readings.forEach((reading) => {
      if (typeof props.xDomain[0] === "number" && reading.timestamp.valueOf() < props.xDomain[0]) {
        return;
      }

      if (typeof props.xDomain[1] === "number" && reading.timestamp.valueOf() > props.xDomain[1]) {
        return;
      }

      filteredSensor.readings.push(reading);
    });

    filteredData.push(filteredSensor);
  });

  function getGraph(xDomain: AxisDomain, yDomain: AxisDomain, data: { sensorName: string; readings: SensorData }[]) {
    console.log("xDomain", xDomain);
    console.log("yDomain", yDomain);
    console.log("props.data", data);
    return <ResponsiveContainer width={props.width ?? "100%"} height={props.height ?? 400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" domain={xDomain} scale="time"
          dataKey={(v) => v.timestamp.valueOf()}
          tickFormatter={formatTime}
        />
        <YAxis type="number" domain={yDomain} dataKey="value" />
        <ZAxis type="number" range={[100]} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value, name) => (
            // if `name` is not 'value' then this is the timestamp
            name !== "value" ? formatDateTime(value as number) : value
          )}
        />
        <Legend />
        {data.map((v, i) => (
          <Scatter name={v.sensorName} data={v.readings} key={i} fill={colors[i]} line />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  }

  return getGraph(props.xDomain ?? ["dataMin", "dataMax"], props.yDomain ?? ["dataMin", "dataMax"], filteredData);
}
