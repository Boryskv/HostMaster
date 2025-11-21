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
    // Calcula o número de dias (mínimo 1 diária)
    const checkInDate = new Date(createReservationDto.checkIn);
    const checkOutDate = new Date(createReservationDto.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    // Se for o mesmo dia ou diferença menor que 1, conta como 1 diária
    const numberOfDays = diffDays <= 0 ? 1 : Math.ceil(diffDays);

    // Calcula o total: numberOfPeople × pricePerPerson × numberOfDays
    const numberOfPeople = createReservationDto.numberOfPeople || 1;
    const pricePerPerson = createReservationDto.pricePerPerson || 0;
    const totalAmount = numberOfPeople * pricePerPerson * numberOfDays;

    console.log('Cálculo da reserva:', {
      checkIn: createReservationDto.checkIn,
      checkOut: createReservationDto.checkOut,
      numberOfDays,
      numberOfPeople,
      pricePerPerson,
      totalAmount
    });

    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      numberOfPeople,
      pricePerPerson,
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
    
    // Recalcula o total se os valores mudaram
    const updateData = { ...updateReservationDto };
    
    // Pega os valores atualizados ou mantém os existentes
    const checkIn = updateData.checkIn || reservation.checkIn;
    const checkOut = updateData.checkOut || reservation.checkOut;
    const numberOfPeople = updateData.numberOfPeople || reservation.numberOfPeople;
    const pricePerPerson = updateData.pricePerPerson || reservation.pricePerPerson;
    
    // Calcula o número de dias (mínimo 1 diária)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    // Se for o mesmo dia ou diferença menor que 1, conta como 1 diária
    const numberOfDays = diffDays <= 0 ? 1 : Math.ceil(diffDays);
    
    // Calcula o total: numberOfPeople × pricePerPerson × numberOfDays
    updateData.totalAmount = numberOfPeople * pricePerPerson * numberOfDays;
    
    console.log('Atualização da reserva:', {
      checkIn,
      checkOut,
      numberOfDays,
      numberOfPeople,
      pricePerPerson,
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
