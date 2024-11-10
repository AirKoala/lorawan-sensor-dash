"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, CardText, Spinner, Row, Table, Button } from "react-bootstrap";
import { registerDevice } from "./actions";

import type { EndDeviceOptions } from "@/lib/ttn";
import { setTimeout } from "timers/promises";

export default function DetailsView() {
  const [deviceDetails, setDeviceDetails] = useState<EndDeviceOptions | null>(null);

  useEffect(() => {
    // registerDevice().then(setDeviceDetails);

    // Placeholder:
    setTimeout(1000).then(() => {
      setDeviceDetails({
        device_id: "device_id",
        dev_eui: "dev_eui",
        dev_addr: "dev_addr",
        app_session_key: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
        network_session_key: Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
      });
    });
  }, []);

  return (
    <Card className="p-3">
      <CardTitle>Sensor Details</CardTitle>
      <CardBody>
        {deviceDetails ? <>
          <div className="bg-danger p-1">
            <CardText className="text-white">
              <Row>
                <span className="align-middle">Please note down the following details for future reference. The following information will NOT be saved for security.</span>
              </Row>
            </CardText>
          </div>
          <Table>
            <tbody>
              <tr>
                <th>Device ID</th>
                <td>{deviceDetails.device_id}</td>
              </tr>
              <tr>
                <th>App EUI</th>
                <td>{deviceDetails.dev_eui}</td>
              </tr>
              <tr>
                <th>Device Address</th>
                <td>{deviceDetails.dev_addr}</td>
              </tr>
              <tr>
                <th>App SKey</th>
                <td>{deviceDetails.app_session_key.toString()}</td>
              </tr>
              <tr>
                <th>Network SKey</th>
                <td>{deviceDetails.network_session_key.toString()}</td>
              </tr>
            </tbody>
          </Table>

          <Button variant="primary" className="mt-3" href={deviceDetails ? `/dashboard/sensor/edit/${deviceDetails.device_id}` : "/dashboard/sensor/list"}>
            Continue
          </Button>
        </> : <>
          <CardText className="d-flex">
            <span className="align-middle">Registering device on TTN...</span>
            <Spinner animation="grow" className="ms-auto" />
          </CardText>
        </>}
      </CardBody>
    </Card >
  );
}
