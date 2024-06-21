import { sensorRepository } from "@/lib/database";

export default function Page() {
	async function getSensors() {
		'use server';
		return await sensorRepository.find();
	}
	
	async function getSensorTable() {
		const sensors = await getSensors();
		return <table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				{sensors.map((sensor) => <tr>
					<td>{sensor.id}</td>
					<td>{sensor.name}</td>
				</tr>)}
			</tbody>
		</table>;
	}

	return (
		<>
			<main>
				<div>
					{getSensorTable()}
				</div>
			</main>
		</>
	);
}

