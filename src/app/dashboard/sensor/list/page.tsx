import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllSensors } from "@/lib/database";
import Link from "next/link";

export default function Page() {
  async function getSensorList() {
    const sensors = await getAllSensors();
    return <fieldset>
      {sensors.map((sensor) => (<span key={sensor.id}>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={sensor.id + "-checkbox"}
            name="sensorId"
            value={sensor.id}
          />
          <label htmlFor={sensor.id + "-checkbox"}>
            {sensor.id}:
            {sensor.name}
          </label>
        </div>
        <br />
      </span>
      ))}
    </fieldset>;
  }

  return (
    <form action="/dashboard/sensor/view" method="get">
      {getSensorList()}
      <Button type="submit">View</Button>
    </form>
  );
}

