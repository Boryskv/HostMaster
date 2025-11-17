import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  create(
    createReservationDto: CreateReservationDto,
    userId: string,
  ): Promise<Reservation> {
    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      userId,
    });
    return this.reservationsRepository.save(reservation);
  }

  findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      relations: ['user', 'room'],
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['user', 'room'],
    });
    if (!reservation) {
      throw new NotFoundException(`Reserva com ID ${id} não encontrada`);
    }
    return reservation;
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    await this.findOne(id);
    await this.reservationsRepository.update(id, updateReservationDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationsRepository.remove(reservation);
  }
}
