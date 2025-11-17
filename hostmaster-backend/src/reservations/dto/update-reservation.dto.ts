import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsString()
  @IsOptional()
  status?: string;
}
