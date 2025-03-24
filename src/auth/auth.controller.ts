import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario autenticado con éxito' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }

  @Get('verify-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Verificar si un token JWT es válido' })
  async verifyToken(@Request() req) {
    return {
      message: 'Token válido',
      user: req.user,
    };
  }
}
