import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../types/userTypes';

export type userType = {
  id: number;
  name: string;
  email: string;
  role: Role;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<userType> {
    const user = await this.prisma.users.findUnique({ where: { email } });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  async login(user: userType) {
    const payload = { sub: user.id, name: user.name, email: user.email, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id },
    };
  }
}
