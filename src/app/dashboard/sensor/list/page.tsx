import { getAllSensors } from "@/lib/database";
// import Sensor from "@/lib/database/entities/sensor.entity";
import Link from "next/link";

export default function Page() {
  // async function getSensors() {
  //   'use server';
  //   const sensorRepository = getAllSensors();
  //   return await sensorRepository.find();
  // }

  async function getSensorTable() {
    const sensors = await getAllSensors();
    return <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {sensors.map((sensor) => <tr key={sensor.id}>
          <td> <Link href={`/dashboard/sensor/view?sensorId=${sensor.id}`}>
            {sensor.id}
          </Link> </td>
          <td>{sensor.name}</td>
        </tr>)}
      </tbody>
    </table>;
  }

  return (
    <>
      <main>
        <div>
          {getSensorTable()}
        </div>
      </main>
    </>
  );
}

