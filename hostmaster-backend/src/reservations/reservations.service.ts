import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Room } from '../rooms/entities/room.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    userId: string,
  ): Promise<Reservation> {
    // Busca o quarto para pegar o preço
    const room = await this.roomsRepository.findOne({
      where: { id: createReservationDto.roomId },
    });

    if (!room) {
      throw new Error('Quarto não encontrado');
    }

    // Calcula o número de dias
    // Adiciona 'T00:00:00' para evitar problemas de timezone
    const checkInDate = new Date(createReservationDto.checkIn + 'T00:00:00');
    const checkOutDate = new Date(createReservationDto.checkOut + 'T00:00:00');
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // Mesma data = 0 diárias, 1 dia de diferença = 1 diária
    const numberOfDays = diffDays;

    // Calcula o total: preço do quarto × número de diárias
    const roomPrice = Number(room.price) || 0;
    const totalAmount = roomPrice * numberOfDays;

    console.log('Cálculo da reserva:', {
      checkIn: createReservationDto.checkIn,
      checkOut: createReservationDto.checkOut,
      numberOfDays,
      roomPrice,
      totalAmount
    });

    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      totalAmount,
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
    const reservation = await this.findOne(id);
    
    // Recalcula o total se as datas ou o quarto mudaram
    const updateData = { ...updateReservationDto };
    
    // Pega os valores atualizados ou mantém os existentes
    const checkIn = updateData.checkIn || reservation.checkIn;
    const checkOut = updateData.checkOut || reservation.checkOut;
    const roomId = updateData.roomId || reservation.roomId;
    
    // Busca o quarto para pegar o preço
    const room = await this.roomsRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new Error('Quarto não encontrado');
    }
    
    // Calcula o número de dias
    // Adiciona 'T00:00:00' para evitar problemas de timezone
    const checkInDate = new Date(checkIn + 'T00:00:00');
    const checkOutDate = new Date(checkOut + 'T00:00:00');
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    // Mesma data = 0 diárias, 1 dia de diferença = 1 diária
    const numberOfDays = diffDays;
    
    // Calcula o total: preço do quarto × número de diárias
    const roomPrice = Number(room.price) || 0;
    updateData.totalAmount = roomPrice * numberOfDays;
    
    console.log('Atualização da reserva:', {
      checkIn,
      checkOut,
      numberOfDays,
      roomPrice,
      totalAmount: updateData.totalAmount
    });
    
    await this.reservationsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationsRepository.remove(reservation);
  }
}
