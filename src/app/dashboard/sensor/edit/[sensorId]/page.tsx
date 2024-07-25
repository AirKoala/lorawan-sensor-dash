import EditForm from "./editForm";
import { getSensorMetadata } from "./actions";

import type { SensorMetadata } from "./actions";

export default async function Page({ params }:
  {
    params: {
      sensorId: string;
    };
}) {
  const sensorMetadata: SensorMetadata = await getSensorMetadata(params.sensorId);

  return (
    <div>
      <h5>Editing Sensor {params.sensorId}</h5>
      <EditForm
	sensorId={params.sensorId}
	sensorMetadata={sensorMetadata}
      />
    </div>
  );
}
