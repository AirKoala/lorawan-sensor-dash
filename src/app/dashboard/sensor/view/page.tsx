import { notFound } from "next/navigation";
import { SensorData, getSensorData } from "./actions";
import View from "./view";

export default async function Page({ searchParams }: {
  searchParams: { sensorId: string | string[] },
}) {
  const sensorData: { [sensorId: string]: SensorData } = {};

  if (!searchParams.sensorId || searchParams.sensorId?.length <= 0) {
    return notFound();
  }

  const sensorIds = (typeof searchParams.sensorId === "string") ? [searchParams.sensorId] : searchParams.sensorId;
  
  const mappedSensorIds: string[] = [];

  for (const sensorId of sensorIds) {
    const data = await getSensorData(sensorId);
    data.forEach((readingGroup, i) => {
      const id = sensorId + "-" + i;
      sensorData[id] = readingGroup;
      mappedSensorIds.push(id);
    });
  }

  return (
    <View initialSensorIds={mappedSensorIds} initialSensorData={sensorData} realSensorIds={sensorIds} />
  )
}
