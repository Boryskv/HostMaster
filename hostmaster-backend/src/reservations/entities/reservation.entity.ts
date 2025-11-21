import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  guestName: string;

  @Column({ type: 'date' })
  checkIn: Date;

  @Column({ type: 'date' })
  checkOut: Date;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  paymentStatus: string; // partial, paid

  @Column({ type: 'int', default: 1 })
  numberOfPeople: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pricePerPerson: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Room, (room) => room.reservations)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column()
  roomId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
