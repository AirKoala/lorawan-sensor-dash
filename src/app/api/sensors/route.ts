import { sensorRepository } from "@/lib/database";

export async function GET() {
	return Response.json(await sensorRepository.find());
}
