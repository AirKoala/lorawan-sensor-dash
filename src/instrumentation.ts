import { begin } from "./collector";
import { initialize } from "@/database";

export async function register() {
  begin({
    url: "mqtt://au1.cloud.thethings.network:1883",
    password:
      "NNSXS.WCKUJEWKHSKR65WJOTI2O5BB4U46FMXPN2NZUBA.PYH4B7YPHW6HDJ7BBVERJ4VCIOTNLYDZ6ZSWP6ZYDPT5UNOXXDKA",
    applicationId: "swin-moisture-sensor",
  });

  await initialize();
}
