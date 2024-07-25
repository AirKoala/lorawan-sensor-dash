"use client";
import { Alert, Button, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { SensorMetadata, updateSensor } from "./actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditForm({ sensorId, sensorMetadata }: {
	sensorId: string
	sensorMetadata: SensorMetadata,
}) {
	const router = useRouter();

	const [alerts, setAlerts] = useState<{
		variant: "info" | "danger",
		text: string,
	}[]>([]);

	return (
		<>
			{
				alerts.map((alert, i) => (
					<Alert key={i} variant={alert.variant}>
						{alert.text}
					</Alert>
				))
			}
			<Form action={async (formData) => {
				setAlerts([{ variant: "info", text: "Saving..." }]);

				try {
					await updateSensor(sensorId, {
						name: formData.get("sensorName") as string,
						type: formData.get("sensorType") as string,
						rawMinimum: parseFloat(formData.get("sensorRawMinimum") as string),
						rawMaximum: parseFloat(formData.get("sensorRawMaximum") as string),
						mappedMinimum: parseFloat(formData.get("sensorMappedMinimum") as string),
						mappedMaximum: parseFloat(formData.get("sensorMappedMaximum") as string),
						unit: formData.get("sensorUnit") as string,
					});
				} catch (e) {
					console.error(e);
					setAlerts([{ variant: "danger", text: "An error occurred, please try again." }])
				} finally {
					setAlerts([{ variant: "info", text: "Updated." }]);
					router.push("/dashboard/sensor/list");
				}
			}}>
				<Form.Group className="mb-3" controlId="sensorName">
					<Form.Label>Sensor Name</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter sensor name"
						name="sensorName"
						defaultValue={sensorMetadata.name}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="sensorType">
					<Form.Label>Sensor Type</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter sensor type"
						name="sensorType"
						defaultValue={sensorMetadata.type}
					/>
				</Form.Group>
				<div className="mb-3 gy-3">
					<Row>
						<h6>Data Mapping</h6>
					</Row>
					<Row>
						<h6>From</h6>
						<Form.Group className="col-6" controlId="sensorRawMinimum">
							<Form.Label>Minimum Value</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter sensor minimum"
								name="sensorRawMinimum"
								defaultValue={sensorMetadata.rawMinimum}
							/>
						</Form.Group>
						<Form.Group className="col-6" controlId="sensorRawMaximum">
							<Form.Label>Maximum Value</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter sensor maximum"
								name="sensorRawMaximum"
								defaultValue={sensorMetadata.rawMaximum}
							/>
						</Form.Group>
					</Row>
					<Row className="mt-3">
						<h6>To</h6>
						<Form.Group className="col-6" controlId="sensorMappedMinimum">
							<Form.Label>Minimum Value</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter sensor minimum"
								name="sensorMappedMinimum"
								defaultValue={sensorMetadata.mappedMinimum}
							/>
						</Form.Group>
						<Form.Group className="col-6" controlId="sensorMappedMaximum">
							<Form.Label>Maximum Value</Form.Label>
							<Form.Control
								type="number"
								placeholder="Enter sensor maximum"
								name="sensorMappedMaximum"
								defaultValue={sensorMetadata.mappedMaximum}
							/>
						</Form.Group>
					</Row>
				</div>
				<Form.Group className="mb-3" controlId="sensorUnit">
					<Form.Label>Data Unit</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter data unit"
						name="sensorUnit"
						defaultValue={sensorMetadata.unit}
					/>
				</Form.Group>
				<Button type="submit">Save</Button>
			</Form>
		</>
	);
}
