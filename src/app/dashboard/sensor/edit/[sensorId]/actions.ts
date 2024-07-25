"use server";

import { getSensorById, saveSensor } from "@/lib/database";
import { Sensor } from "@/lib/database/entities";
import { notFound } from "next/navigation";

// export type Sensor = {
// 	id: string;
// 	name?: string;
// 	minimum?: number;
// 	maximum?: number;
// };

export type SensorMetadata = {
	name?: string;
	type?: string;
	rawMinimum?: number;
	rawMaximum?: number;
	mappedMinimum?: number;
	mappedMaximum?: number;
	unit?: string;
};

export async function updateSensor(id: string, sensorMetadata: SensorMetadata) {
	const sensor = await getSensorById(id);
	if (!sensor) {
		return notFound();
	}

	// if (sensorMetadata.name) {
	// 	sensor.name = sensorMetadata.name;
	// }
	// if (sensorMetadata.rawMinimum) {
	// 	sensor.rawMinimum = sensorMetadata.rawMinimum;
	// }
	// if (sensorMetadata.rawMaximum) {
	// 	sensor.rawMaximum = sensorMetadata.rawMaximum;
	// }
	// if (sensorMetadata.mappedMinimum) {
	// 	sensor.mappedMinimum = sensorMetadata.mappedMinimum;
	// }
	// if (sensorMetadata.mappedMaximum) {
	// 	sensor.mappedMaximum = sensorMetadata.mappedMaximum;
	// }
	// if (sensorMetadata.unit) {
	// 	sensor.unit = sensorMetadata.unit;
	// }
	// if (sensorMetadata.type) {
	// 	sensor.type = sensorMetadata.type;
	// }

	sensor.name = sensorMetadata.name ?? sensor.name;
	sensor.rawMinimum = sensorMetadata.rawMinimum ?? sensor.rawMinimum;
	sensor.rawMaximum = sensorMetadata.rawMaximum ?? sensor.rawMaximum;
	sensor.mappedMinimum = sensorMetadata.mappedMinimum ?? sensor.mappedMinimum ?? sensor.mappedMinimum;
	sensor.mappedMaximum = sensorMetadata.mappedMaximum ?? sensor.mappedMaximum ?? sensor.mappedMaximum;
	sensor.unit = sensorMetadata.unit ?? sensor.unit;
	sensor.type = sensorMetadata.type ?? sensor.type;

	await saveSensor(sensor);
}

export async function getSensorMetadata(id: string): Promise<SensorMetadata> {
	const sensor = await getSensorById(id);
	if (!sensor) {
		return notFound();
	}

	return {
		name: sensor.name,
		rawMinimum: sensor.rawMinimum,
		rawMaximum: sensor.rawMaximum,
		mappedMinimum: sensor.mappedMinimum,
		mappedMaximum: sensor.mappedMaximum,
		unit: sensor.unit,
		type: sensor.type,
	};
}
