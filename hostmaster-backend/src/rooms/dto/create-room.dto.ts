import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsString()
  @IsOptional()
  description?: string;
}
