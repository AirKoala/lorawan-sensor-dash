"use server";

import { getReadingsForSensorId, getSensorById } from "@/lib/database"
import { notFound } from "next/navigation";

export type SensorData = {
  sensorName: string;
  readings: {
    value: number;
    timestamp: Date;
  }[];
  dataMapping?: {
    rawMinimum: number;
    rawMaximum: number;
    mappedMinimum: number;
    mappedMaximum: number;
  };
  unit?: string;
};

export async function getSensorData(sensorId: string): Promise<SensorData> {
  const sensor = await getSensorById(sensorId);

  if (!sensor) {
    return notFound();
  }


  const readings = await getReadingsForSensorId(sensorId);

  const data: SensorData = {
    sensorName: sensor.name || "Unknown",
    unit: sensor.unit,
    readings: readings.map((reading) => ({
      value: reading.value,
      timestamp: reading.timestamp,
    })),
  };


  if (!(sensor.rawMinimum === undefined
    || sensor.rawMaximum === undefined
    || sensor.mappedMinimum === undefined
    || sensor.mappedMaximum === undefined)) {
    data.dataMapping = {
      rawMinimum: sensor.rawMinimum,
      rawMaximum: sensor.rawMaximum,
      mappedMinimum: sensor.mappedMinimum,
      mappedMaximum: sensor.mappedMaximum,
    };
  }

  return data;
}

