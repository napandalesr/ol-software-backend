import { Module } from '@nestjs/common';
import { BusinessmanService } from './businessman.service';
import { BusinessmanController } from './businessman.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessmanController],
  providers: [BusinessmanService],
})
export class BusinessmanModule {}
