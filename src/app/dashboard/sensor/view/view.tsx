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

  const [xDomain, setXDomain] = useState<[
    string | number, string | number
  ]>(["dataMin", Date.now()]);
  // const [yDomain, setYDomain] = useState<[
  //   string | number, string | number
  // ]>(["dataMin", "dataMax"]);

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
  });

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

  function mapReading(
    value: number,
    mapping: {
      rawMinimum: number,
      rawMaximum: number,
      mappedMinimum: number,
      mappedMaximum: number
    }
  ): number {
    return (value - mapping.rawMinimum)
      * (mapping.mappedMaximum - mapping.mappedMinimum)
      / (mapping.rawMaximum - mapping.rawMinimum)
      + mapping.mappedMinimum;
  }


  function getReadingsForGraph(
    data: { [sensorId: string]: SensorData }, sensorIds: string[]
  ) {
    let sensors = sensorIds.map(
      (sensorId) => (data[sensorId] ?? { sensorName: "Unknown", readings: [] })
    );

    sensors = sensors.map((sensor) => {
      if (sensor.dataMapping === undefined) {
        return sensor;
      }

      const newSensor = { ...sensor };
      newSensor.readings = newSensor.readings.map((reading) => (
        {
          ...reading,
          // @ts-ignore
          value: mapReading(reading.value, sensor.dataMapping),
        }
      ));

      return newSensor;
    });

    return sensors;
  }

  return (
    isClient && sensorIds?.length > 0 ? (
      <Container>
        <Row>
          <Button className="w-auto me-2 col-2" disabled={isUpdating}>
            {isUpdating ? "Updating..." : <RefreshIcon />}
          </Button>

          <Form.Select
            className="w-auto col-10"
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
        </Row>

        {props.showTable && getReadingsTable()}
        <Row className="col-md-9">
          {
            combined
              // @ts-ignore
              ? <SensorGraph data={getReadingsForGraph(sensorData, sensorIds)} xDomain={xDomain} key={combined}/>
              : sensorIds.map((sensorId) => (
              // @ts-ignore
                <SensorGraph data={getReadingsForGraph(sensorData, [sensorId])} xDomain={xDomain} key={combined}/>
              ))
          }
        </Row>
      </Container>
    ) : <p>Loading...</p>
  );
}
