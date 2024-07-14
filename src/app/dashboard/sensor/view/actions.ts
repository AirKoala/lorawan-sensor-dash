"use server";

import { getReadingsForSensorId, getSensorById } from "@/lib/database"
import { notFound } from "next/navigation";

export type SensorData = {
  sensorName: string;
  readings: {
    value: number;
    timestamp: Date;
  }[];
};

export async function getSensorData(sensorId: string): Promise<SensorData> {
  const sensor = await getSensorById(sensorId);

  if (!sensor) {
    return notFound();
  }

  const readings = await getReadingsForSensorId(sensorId);

  const data =  {
    sensorName: sensor.name || "Unknown",
    readings: readings.map((reading) => ({
      value: reading.value,
      timestamp: reading.timestamp,
    })),
  };

  return data;
}

