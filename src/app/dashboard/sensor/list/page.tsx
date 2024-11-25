import { getAllSensors } from "@/lib/database";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import DownloadButton from './download-button';
import { DownloadIcon, Settings2 as SettingsIcon } from "lucide-react";
import Link from "next/link";

import { getEndDevice } from "@/lib/ttn";
import { readingsCsv } from "./actions";

export default function Page() {
  async function getSensorList() {
    const sensors = await getAllSensors();
    sensors.forEach(async (sensor) => {
      console.log(sensor.id);
      const res = await getEndDevice(sensor.id);
      console.log(JSON.stringify(res));
    });

    return <Table hover>
      <thead>
        <tr>
          <th>Show</th>
          <th>Sensor ID</th>
          <th>Sensor Name</th>
          <th>Sensor Type</th>
          <th>Number of Readings</th>
          <th>Data Mapping</th>
          <th>Data Unit</th>
        </tr>
      </thead>
      <tbody>
        {sensors.map((sensor) => <tr key={sensor.id}>
          <td>
            <Form.Check
              inline
              aria-label={"Show " + sensor.name}
              type="checkbox"
              id={sensor.id + "-checkbox"}
              name="sensorId"
              value={sensor.id}
            />
          </td>
          <td>
            <Link href={"/dashboard/sensor/edit/" + sensor.id} passHref={true}>
              <SettingsIcon />
            </Link>
            <DownloadButton sensorId={sensor.id} />
            <span className="ms-2">
              {sensor.id}
            </span>
          </td>
          <td> {sensor.name} </td>
          <td> {sensor.type ?? "-"} </td>
          <td> {sensor.numReadings} </td>
          {
            (sensor.rawMinimum === null || sensor.rawMaximum === null || sensor.mappedMinimum === null || sensor.mappedMaximum === null) ? (
              <td>-</td>
            ) : (
              <td> [{sensor.rawMinimum}, {sensor.rawMaximum}] → [{sensor.mappedMinimum}, {sensor.mappedMaximum}] </td>
            )
          }
          <td> {sensor.unit ?? "-"} </td>
        </tr>)}
      </tbody>
    </Table>;
  }

  return (
    <Form action="/dashboard/sensor/view" method="get">
      {getSensorList()}
      <Button type="submit" variant="primary">View</Button>
      <Button variant="primary" href="/dashboard/sensor/add"
        className="ms-2"> Add New </Button>
    </Form>
  );
}

