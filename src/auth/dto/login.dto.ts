import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@email.com', description: 'Correo del usuario' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario' })
  password: string;
}
