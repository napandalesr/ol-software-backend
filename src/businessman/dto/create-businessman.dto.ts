import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Statuses } from '../../types/busubessmanTypes';

export class CreateBusinessmanDto {
  @ApiProperty({ example: 'Empresa XYZ', description: 'Nombre del comerciante' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Bogotá', description: 'Ciudad del comerciante' })
  @IsString()
  city: string;

  @ApiProperty({ example: '+57 3101234567', description: 'Teléfono (opcional)' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'empresa@email.com', description: 'Correo electrónico (opcional)' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ enum: Statuses, example: 'ACTIVE' })
  @IsEnum(Statuses)
  status: Statuses;
}
