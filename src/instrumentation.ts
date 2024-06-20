import { startCollector } from "@/lib/collector";
import { initialize } from "@/lib/database";

export async function register() {
  if (!process.env.TTN_MQTT_URL) {
    throw new Error("TTN_MQTT_URL is required");
  }
  if (!process.env.TTN_MQTT_API_KEY) {
    throw new Error("TTN_MQTT_API_KEY is required");
  }
  if (!process.env.TTN_APPLICATION_ID) {
    throw new Error("TTN_APPLICATION_ID is required");
  }

  startCollector({
    url: process.env.TTN_MQTT_URL,
    password: process.env.TTN_MQTT_API_KEY,
    applicationId: process.env.TTN_APPLICATION_ID,
  });

  await initialize();
}
