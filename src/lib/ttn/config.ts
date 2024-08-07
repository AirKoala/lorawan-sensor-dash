import type { Config } from "the-things-network/dist/interfaces/config.interface";

if (!process.env.TTN_APPLICATION_API_KEY) {
  throw new Error("TTN_APPLICATION_API_KEY is required");
}

if (!process.env.TTN_APPLICATION_ID) {
  throw new Error("TTN_APPLICATION_ID is required");
}

export const APPLICATION_ID = process.env.TTN_APPLICATION_ID;

export const config: Config = {
  IDENTITY_SERVER: 'eu1.cloud.thethings.network',
  NETWORK_SERVER: 'au1.cloud.thethings.network',
  APPLICATION_SERVER: 'au1.cloud.thethings.network',
  JOIN_SERVER: 'au1.cloud.thethings.network',
  API_KEY: process.env.TTN_APPLICATION_API_KEY,
};

export default config;
