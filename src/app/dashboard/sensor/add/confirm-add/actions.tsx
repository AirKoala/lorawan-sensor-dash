"use server";
import { createSensor } from "@/lib/database";
import { createEndDevice } from "@/lib/ttn";
import type { EndDeviceOptions } from "@/lib/ttn";

export async function registerDevice(): Promise<EndDeviceOptions> {
  const device = await createEndDevice();

  await createSensor(device.device_id);
  
  return device;
}
