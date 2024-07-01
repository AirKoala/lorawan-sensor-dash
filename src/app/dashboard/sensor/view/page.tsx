import { getReadingsForSensorId, getSensorById } from "@/lib/database"
import { notFound } from "next/navigation";
import SensorGraph from "./sensor-graph";

export default async function Page({ searchParams }: {
  searchParams: { sensorId: string | string[] },
}) {
  if (!searchParams.sensorId || searchParams.sensorId?.length <= 0) {
    return notFound();
  }

  const sensorIds = (typeof searchParams.sensorId === "string") ? [searchParams.sensorId] : searchParams.sensorId;

  const sensor = await getSensorById(sensorIds[0]);
  if (!sensor) {
    return notFound();
  }

  const readings = await (async () => {
    "use server";
    const readings = await getReadingsForSensorId(sensorIds[0]);
    if (!readings || readings.length === 0) {
      return notFound();
    }
    return readings;
  })();

  async function getReadingsTable() {
    return <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Value</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {readings.map((reading) => <tr key={reading.id}>
          <td>{reading.id}</td>
          <td>{reading.value}</td>
          <td>{reading.timestamp.toLocaleString()}</td>
        </tr>)}
      </tbody>
    </table>;
  }

  async function getReadingsForGraph() {
    return {
      sensorName: sensor?.name ?? "Unknown",
      values: readings.map((reading) => ({
        timestamp: reading.timestamp,
        value: reading.value
      })),
    };
  }

  return (
    <>
      {getReadingsTable()}
      <SensorGraph data={[await getReadingsForGraph()]} />
    </>
  )
}
