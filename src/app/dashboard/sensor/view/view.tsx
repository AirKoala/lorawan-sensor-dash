"use client";

import { useEffect, useState } from "react";
import { SensorData, getSensorData } from "./actions";
import SensorGraph from "./sensor-graph";
import { Button } from "@/components/ui/button";

type SensorDataMap = { [sensorId: string]: SensorData };

export default function View(props: {
  initialSensorData: SensorDataMap,
  initialSensorIds: string[],
  showTable?: boolean,
}) {
  const [isClient, setIsClient] = useState(false);

  const [sensorData, setSensorData] = useState(props.initialSensorData);
  const [sensorIds, setSensorIds] = useState(props.initialSensorIds);

  const [isUpdating, setIsUpdating] = useState(false);

  async function updateData() {
    setIsUpdating(true);
    const newSensorData: SensorDataMap = {};
    for (const sensorId of sensorIds) {
      const data = await getSensorData(sensorId);
      newSensorData[sensorId] = data;
    }

    setSensorData(newSensorData);
    setIsUpdating(false);
  }


  useEffect(() => {
    setIsClient(true);

    const updateDataInterval = setInterval(updateData, 15000); // 15 seconds

    // Clear interval on unmount, to prevent memory leaks
    return () => clearInterval(updateDataInterval);
  }, []);

  // useEffect(() => {
  //   setSensorData(initialSensorData);
  //   setSensorIds(initialSensorIds);
  // }, []);

  function flattenData(data: { [sensorId: string]: SensorData }) {
    const flattenedData: {
      sensorId: string;
      sensorName: string;
      value: number;
      timestamp: Date;
    }[] = [];

    sensorIds.forEach((sensorId) => {
      if (data[sensorId]) {
        data[sensorId].readings.forEach((reading) => {
          flattenedData.push({
            sensorId: sensorId,
            sensorName: data[sensorId].sensorName,
            value: reading.value,
            timestamp: reading.timestamp
          });
        });
      }
    });

    return flattenedData;
  };

  function getReadingsTable() {
    return <table>
      <thead>
        <tr>
          <th>Sensor ID</th>
          <th>Sensor Name</th>
          <th>Value</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {flattenData(sensorData).map((reading, i) => <tr key={i}>
          <td>{reading.sensorId}</td>
          <td>{reading.sensorName}</td>
          <td>{reading.value}</td>
          <td>{reading.timestamp.toLocaleString()}</td>
        </tr>)}
      </tbody>
    </table>;
  }

  function getReadingsForGraph(data: { [sensorId: string]: SensorData }, sensorIds: string[]) {
    return sensorIds.map(
      (sensorId) => (data[sensorId] ?? { sensorName: "Unknown", readings: [] })
    );
  }

  return (
    isClient && sensorIds?.length > 0 ? (
      <>
        {/* isUpdating && <p>Updating...</p> */}
        {isUpdating
          ? <Button disabled>Updating...</Button>
          : <Button onClick={updateData}>Update</Button>}
        {props.showTable && getReadingsTable()}
        <SensorGraph data={getReadingsForGraph(sensorData, sensorIds)} />
      </>
    ) : <p>Loading...</p>
  );
}
