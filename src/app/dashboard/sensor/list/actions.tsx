"use server";

import { getReadingsForSensorId } from "@/lib/database";

export async function readingsCsv(sensorId: string): Promise<string> {
  // Generate a CSV string from the readings for the given sensor ID
  
  const readings = await getReadingsForSensorId(sensorId);
  const numValues = readings[0].values.length;

  let header = "timestamp";
  for (let i = 0; i < numValues; i++) {
    header += `,value${i}`;
  }
  
  let csv = header + "\n";
  readings.forEach((reading) => {
    csv += `${reading.timestamp.toISOString()},`;
    csv += reading.values.join(",");
    csv += "\n";
  });

  return csv;
}
