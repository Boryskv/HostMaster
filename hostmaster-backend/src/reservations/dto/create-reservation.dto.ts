import { IsNotEmpty, IsString, IsDateString, IsUUID } from 'class-validator';

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
}
