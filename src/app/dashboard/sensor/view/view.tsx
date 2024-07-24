"use client";

import { useEffect, useState } from "react";
import { SensorData, getSensorData } from "./actions";
import SensorGraph from "./sensor-graph";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { RefreshCw as RefreshIcon } from "lucide-react";

import { AxisDomain } from "recharts/types/util/types";
import { Container, Row } from "react-bootstrap";

type SensorDataMap = { [sensorId: string]: SensorData };

export default function View(props: {
  initialSensorData: SensorDataMap,
  initialSensorIds: string[],
  showTable?: boolean,
}) {
  const [isClient, setIsClient] = useState(false);

  const [sensorData, setSensorData] = useState(props.initialSensorData);
  const [sensorIds, setSensorIds] = useState(props.initialSensorIds);

  const [isUpdating, setIsUpdating] = useState(false);
  const [combined, setCombined] = useState(false);

  const [xDomain, setXDomain] = useState<AxisDomain>(["dataMin", Date.now()]);
  const [yDomain, setYDomain] = useState<AxisDomain>(["dataMin", "dataMax"]);

  async function updateData() {
    setIsUpdating(true);
    const newSensorData: SensorDataMap = {};
    for (const sensorId of sensorIds) {
      const data = await getSensorData(sensorId);
      newSensorData[sensorId] = data;
    }

    setSensorData(newSensorData);
    setIsUpdating(false);
  }


  useEffect(() => {
    setIsClient(true);

    const updateDataInterval = setInterval(updateData, 15000); // 15 seconds

    // Clear interval on unmount, to prevent memory leaks
    return () => clearInterval(updateDataInterval);
  }, []);

  // useEffect(() => {
  //   setSensorData(initialSensorData);
  //   setSensorIds(initialSensorIds);
  // }, []);

  function flattenData(data: { [sensorId: string]: SensorData }) {
    const flattenedData: {
      sensorId: string;
      sensorName: string;
      value: number;
      timestamp: Date;
    }[] = [];

    sensorIds.forEach((sensorId) => {
      if (data[sensorId]) {
        data[sensorId].readings.forEach((reading) => {
          flattenedData.push({
            sensorId: sensorId,
            sensorName: data[sensorId].sensorName,
            value: reading.value,
            timestamp: reading.timestamp
          });
        });
      }
    });

    return flattenedData;
  };

  function getReadingsTable() {
    return <table>
      <thead>
        <tr>
          <th>Sensor ID</th>
          <th>Sensor Name</th>
          <th>Value</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {flattenData(sensorData).map((reading, i) => <tr key={i}>
          <td>{reading.sensorId}</td>
          <td>{reading.sensorName}</td>
          <td>{reading.value}</td>
          <td>{reading.timestamp.toLocaleString()}</td>
        </tr>)}
      </tbody>
    </table>;
  }

  function getReadingsForGraph(data: { [sensorId: string]: SensorData }, sensorIds: string[]) {
    return sensorIds.map(
      (sensorId) => (data[sensorId] ?? { sensorName: "Unknown", readings: [] })
    );
  }

  return (
    isClient && sensorIds?.length > 0 ? (
      <Container>
        <Row className="col-md-3">
          <Button className="w-auto me-2" disabled={isUpdating}>
            {isUpdating ? "Updating..." : <RefreshIcon />}
          </Button>

          <Form.Select
            className="w-auto"
            onChange={(event) => {
              const range = event.target.value;
              switch (range) {
                case "hour":
                  setXDomain([Date.now() - 1000 * 60 * 60, Date.now()]);
                  break;
                case "day":
                  setXDomain([Date.now() - 1000 * 60 * 60 * 24, Date.now()]);
                  break;
                case "all":
                  setXDomain(["dataMin", Date.now()]);
                  break;
              }
              console.log(range, xDomain);
            }}>
            <option value="hour">Past Hour</option>
            <option value="day">Past 24 Hours</option>
            <option value="all">All Time</option>
          </Form.Select>

          {
            // {sensorIds.length > 1 && <div className="flex items-center space-x-2 m-2">
            // <Form.Check id="combined-checkbox" onCheckedChange={(checked) => {
            //   setCombined(checked.valueOf() as boolean);
            // }} />
            // <label
            //   htmlFor="combined-checkbox"
            //   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            // >
            //   Combine graphs
            // </label>
            //</div >}
          }

        </Row>

        {props.showTable && getReadingsTable()}
        <Row className="col-md-9">
          {
            combined
              ? <SensorGraph data={getReadingsForGraph(sensorData, sensorIds)} xDomain={xDomain} />
              : sensorIds.map((sensorId) => (
                <SensorGraph data={getReadingsForGraph(sensorData, [sensorId])} xDomain={xDomain} />
              ))
          }
        </Row>
      </Container>
    ) : <p>Loading...</p>
  );
}
