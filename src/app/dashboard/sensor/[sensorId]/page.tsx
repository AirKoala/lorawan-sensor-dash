import { getReadingsForSensorId } from "@/lib/database"
import { notFound } from "next/navigation";

export default async function Page({ params }: {
  params: {
    sensorId: string,
  }
}) {
  // const sensor = await getSensorById(params.sensorid);
  // if (!sensorExists(params.sensorId)) {
  //   return notFound();
  // }

  async function getReadingsTable() {
    "use server";
    const readings = await getReadingsForSensorId(params.sensorId);

    if (!readings || readings.length === 0) {
      return notFound();
    }

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

  return (
    <>
      {getReadingsTable()}
    </>
  )
}
