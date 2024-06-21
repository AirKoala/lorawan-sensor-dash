import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import type Reading from './reading.entity';

@Entity()
export default class Sensor {
  constructor(id: string, name?: string) {
    this.id = id;
    this.name = name;
  }

  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  name?: string;

  @OneToMany("Reading", (reading: Reading) => reading.sensor)
  readings!: Reading[];

  // @Column()
  // location!: string;

  // @Column()
  // type: string
}
