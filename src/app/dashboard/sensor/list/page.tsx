import { getAllSensors } from "@/lib/database";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { Settings2 as SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  async function getSensorList() {
    const sensors = await getAllSensors();
    return <Table hover>
      <thead>
        <tr>
          <th className="px-2">Show</th>
          <th className="px-2">Sensor ID</th>
          <th className="px-2">Sensor Name</th>
        </tr>
      </thead>
      <tbody>
        {sensors.map((sensor) => <tr key={sensor.id}>
          <td className="px-2">
            <Form.Check
              inline
              aria-label={"Show " + sensor.name}
              type="checkbox"
              id={sensor.id + "-checkbox"}
              name="sensorId"
              value={sensor.id}
            />
          </td>
          <td className="px-2">
            <Link href={"/dashboard/sensor/edit/" + sensor.id} passHref={true}>
              <SettingsIcon />
            </Link>
            <span className="ms-2">
              {sensor.id}
            </span>
          </td>
          <td className="px-2">
            {sensor.name}
          </td>
        </tr>)}
      </tbody>
    </Table>;
  }

  return (
    <Form action="/dashboard/sensor/view" method="get">
      {getSensorList()}
      <Button type="submit" variant="primary">View</Button>
    </Form>
  );
}

