import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column()
  type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
