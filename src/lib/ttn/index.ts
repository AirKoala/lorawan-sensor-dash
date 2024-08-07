import { APPLICATION_ID, config } from "./config";
import { EndDevice } from "the-things-network";
import { randomBytes } from "crypto";

const device = new EndDevice(APPLICATION_ID, config);

export type EndDeviceOptions = {
  device_id: string;
  network_session_key: Buffer;
  app_session_key: Buffer;
  dev_eui: string;
  dev_addr: string;
};

function generateKey(): Buffer {
  return randomBytes(128 / 8);
}

async function generateDeviceOptions(): Promise<EndDeviceOptions> {
  console.debug("Generating device options.");
  const device = new EndDevice(APPLICATION_ID, config);
  const eui = (await device.issueDevEUI()).dev_eui;
  return {
    device_id: `eui-${eui.toLowerCase()}`,
    network_session_key: generateKey(),
    app_session_key: generateKey(),
    dev_eui: eui,
    dev_addr: randomBytes(32 / 8).toString("hex"),
  };
}

export async function createEndDevice(options?: EndDeviceOptions) {
  if (!options) {
    options = await generateDeviceOptions();
  }

  console.log("Creating device with options:", options);

  console.log("Registering on IS.");
  await device.createEndDeviceIS({
    end_device: {
      ids: {
        device_id: options.device_id,
        dev_eui: options.dev_eui,
        application_ids: { application_id: APPLICATION_ID },
      },
      version_ids: {
        band_id: "AU_915_928_FSB_2",
      },
      network_server_address: config.NETWORK_SERVER,
      application_server_address: config.APPLICATION_SERVER,
    },
  });

  console.log("Registering on NS.");
  await device.setEndDeviceNS({
    end_device: {
      supports_join: false,
      lorawan_version: "1.0.1",
      ids: {
        device_id: options.device_id,
        dev_eui: options.dev_eui,
        application_ids: { application_id: APPLICATION_ID },
      },
      session: {
        keys: {
          f_nwk_s_int_key: {
            key: options.network_session_key.toString("base64"),
          },
        },
        dev_addr: options.dev_addr,
      },
      mac_settings: {
        resets_f_cnt: true,
      },
      lorawan_phy_version: "1.0.1",
      frequency_plan_id: "AU_915_928_FSB_2",
    },
  });

  console.log("Registering on AS.");
  await device.setEndDeviceAS({
    end_device: {
      ids: {
        device_id: options.device_id,
        dev_eui: options.dev_eui,
        application_ids: { application_id: APPLICATION_ID },
      },
      session: {
        keys: {
          app_s_key: {
            key: options.app_session_key.toString("base64"),
          },
        },
        dev_addr: options.dev_addr,
      },
    },
  });

  return options;
}

export async function getEndDevice(id: string) {
  const payload = { device_id: id };
  return await device.getEndDeviceInfoNS(payload);
}

