import mqtt from "mqtt";
import entities from '@/database/entities';
import { sensorRepository, readingRepository } from '@/database';

interface MqttClientOptions {
  url: string;
  applicationId: string;
  password: string
}

interface SensorReading {
  deviceId: string;
  receivedAt: string;
  payload: any
}

export function begin(options: MqttClientOptions) {
  const client = mqtt.connect(options.url, {
    username: options.applicationId + "@ttn",
    password: options.password,
  });

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe(`v3/${options.applicationId}@ttn/devices/+/up`);
  });

  client.on("message", (_, message) => {
    const parsed = parseMessage(message);
    console.log("Received:", parsed);
    saveReading(parsed);
  });
}

async function saveReading(reading: SensorReading) {
  readingRepository.save(new entities.Reading(
    reading.payload,
    new Date(reading.receivedAt),
    await sensorRepository.findOneBy({
      id: reading.deviceId,
    }) || new entities.Sensor(reading.deviceId)
  ));
}


function parseMessage(rawMessage: Buffer): SensorReading {
  const received = JSON.parse(rawMessage.toString());

  return {
    deviceId: received.end_device_ids.device_id,
    receivedAt: received.received_at,
    payload: received.uplink_message.decoded_payload.value,
  }
}
