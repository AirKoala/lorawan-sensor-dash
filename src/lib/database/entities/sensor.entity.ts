import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import type { Reading } from './reading.entity';

@Entity()
export class Sensor {
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

  @Column({ nullable: true })
  rawMinimum?: number;

  @Column({ nullable: true })
  rawMaximum?: number;

  @Column({ nullable: true })
  mappedMinimum?: number;

  @Column({ nullable: true })
  mappedMaximum?: number;

  @Column({ nullable: true })
  unit?: string;
  
  @Column({ nullable: true })
  type?: string
}
