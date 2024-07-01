"use server";

import "reflect-metadata";
import { DataSource } from "typeorm";
import * as entities from "./entities";

const database = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true,
  cache: true,
  entities: [entities.Sensor, entities.Reading],
});

// export const sensorRepository = database.getRepository(entities.Sensor);
// export const readingRepository = database.getRepository(entities.Reading);

async function ensureConnection() {
  if (database.isInitialized) return;

  try {
    console.log("Initializing database...");
    await database.initialize();
    console.log("Database initialized.");
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
}

export async function getDatabase() {
  await ensureConnection();
  return database;
}

export async function getSensorRepository() {
  await ensureConnection();
  return database.getRepository(entities.Sensor);
}

export async function getReadingRepository() {
  await ensureConnection();
  return database.getRepository(entities.Reading);
}

export async function getAllSensors(): Promise<entities.Sensor[]> {
  return (await getSensorRepository()).find({ cache: true });
}

export async function getSensorById(id: string): Promise<entities.Sensor | null> {
  return (await getSensorRepository()).findOneBy({ id });
}

export async function getReadingsFor(sensor: entities.Sensor): Promise<entities.Reading[]> {
  return (await getReadingRepository()).find({
    where: { sensor },
    cache: true
  });
}

export async function getReadingsForSensorId(sensorId: string): Promise<entities.Reading[]> {
  return (await getReadingRepository()).find({
    where: { sensor: { id: sensorId } },
    cache: true
  });
}

export async function sensorExists(id: string): Promise<boolean> {
  return !!(await (await getSensorRepository()).findOneBy({ id }));
}

export async function saveReading(reading: {
  payload: number,
  receivedAt: string,
  deviceId: string
}) {
  (await getReadingRepository()).save(new entities.Reading(
    reading.payload,
    new Date(reading.receivedAt),
    (await (await getSensorRepository()).findOneBy({
      id: reading.deviceId,
    })) || new entities.Sensor(reading.deviceId)
  ));
}

// function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
//   if (prevEntities.length !== newEntities.length) return true;
//
//   for (let i = 0; i < prevEntities.length; i++) {
//     if (prevEntities[i] !== newEntities[i]) return true;
//   }
//
//   return false;
// }

