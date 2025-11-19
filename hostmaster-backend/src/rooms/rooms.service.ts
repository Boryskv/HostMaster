import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    // Verifica se já existe um quarto com esse número
    const existingRoom = await this.roomsRepository.findOne({
      where: { number: createRoomDto.number },
    });

    if (existingRoom) {
      throw new ConflictException(`Quarto ${createRoomDto.number} já existe`);
    }

    const room = this.roomsRepository.create(createRoomDto);
    return this.roomsRepository.save(room);
  }

  findAll(): Promise<Room[]> {
    return this.roomsRepository.find();
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Quarto com ID ${id} não encontrado`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    await this.findOne(id);
    await this.roomsRepository.update(id, updateRoomDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const room = await this.findOne(id);
    await this.roomsRepository.remove(room);
  }
}
