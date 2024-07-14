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

  for (const sensorId of sensorIds) {
    const data = await getSensorData(sensorId);
    sensorData[sensorId] = data;
  }

  // console.log(sensorData);
  // console.log(sensorIds);

  return (
    <View initialSensorIds={sensorIds} initialSensorData={sensorData} />
  )
}
