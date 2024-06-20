import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Sensor from './sensor.entity';

@Entity()
export default class Reading {
  constructor (value: number, timestamp: Date, sensor: Sensor) {
    this.value = value;
    this.timestamp = timestamp;
    this.sensor = sensor;
  }

  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    nullable: false,
    type: 'double',
  })
  value!: number

  @Column({
    nullable: false,
  })
  timestamp!: Date

  @ManyToOne(() => Sensor, sensor => sensor.readings, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  sensor!: Sensor
}
