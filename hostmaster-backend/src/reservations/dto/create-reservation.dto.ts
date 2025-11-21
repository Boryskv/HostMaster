import { IsNotEmpty, IsString, IsDateString, IsUUID, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsDateString()
  @IsNotEmpty()
  checkIn: string;

  @IsDateString()
  @IsNotEmpty()
  checkOut: string;

  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsOptional()
  paymentStatus?: string;

  @IsNumber()
  @IsOptional()
  numberOfPeople?: number;

  @IsNumber()
  @IsOptional()
  pricePerPerson?: number;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;
}
