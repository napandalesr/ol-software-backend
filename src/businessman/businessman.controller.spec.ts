import { Test, TestingModule } from '@nestjs/testing';
import { BusinessmanController } from './businessman.controller';
import { BusinessmanService } from './businessman.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';

describe('BusinessmanController', () => {
  let controller: BusinessmanController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessmanController],
      providers: [BusinessmanService,
                { provide: PrismaService, useValue: mockDeep<PrismaService>() },],
    }).compile();

    controller = module.get<BusinessmanController>(BusinessmanController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
