import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import type { Sensor } from './sensor.entity';

@Entity()
export class Reading {
  constructor(values: number[], timestamp: Date, sensor: Sensor) {
    this.values = values;
    this.timestamp = timestamp;
    this.sensor = sensor;
  }

  @PrimaryGeneratedColumn()
  id!: number

  // @Column({
  //   nullable: false,
  //   type: 'simple-array',
  // })
  @Column('simple-array', {nullable: false})
  values!: number[]

  @Column({
    nullable: false,
  })
  timestamp!: Date

  @ManyToOne("Sensor", (sensor: Sensor) => sensor.readings, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  sensor!: Sensor
}
