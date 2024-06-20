import "reflect-metadata";
import { DataSource } from "typeorm";
import entities from "./entities";

export const database = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true,
  entities,
});

export const sensorRepository = database.getRepository(entities.Sensor);
export const readingRepository = database.getRepository(entities.Reading);

export async function initialize() {
  try {
    await database.initialize();
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }

  console.log("Database initialized.");
}
