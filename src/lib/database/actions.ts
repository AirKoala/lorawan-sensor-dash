import { sensorRepository } from '@/lib/database';

export function getSensors() {
  return sensorRepository.find();
}
