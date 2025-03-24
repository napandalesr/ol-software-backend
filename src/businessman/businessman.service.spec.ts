import { Test, TestingModule } from '@nestjs/testing';
import { BusinessmanService } from './businessman.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep } from 'jest-mock-extended';

describe('BusinessmanService', () => {
  let service: BusinessmanService;
  let prisma: PrismaService;

  beforeEach(async () => {

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          BusinessmanService,
          { provide: PrismaService, useValue: mockDeep<PrismaService>() },
        ],
      }).compile();
  
      service = module.get<BusinessmanService>(BusinessmanService);
      prisma = module.get<PrismaService>(PrismaService);
  });

  it('debería devolver comerciantes paginados y el total de registros', async () => {
    const mockBusinessmen = [
      { id: 1, name: "Comerciante 1", city: "Bogotá", _count: { establishments: 3 } },
      { id: 2, name: "Comerciante 2", city: "Medellín", _count: { establishments: 5 } },
    ];
    
    (prisma.businessman.count as jest.Mock).mockResolvedValue(10);
    (prisma.businessman.findMany as jest.Mock).mockResolvedValue(mockBusinessmen);

    const result = await service.findAll(1, 5);
    
    expect(result.totalRecords).toBe(10);
    expect(result.data).toEqual(mockBusinessmen);
  });

  it('debería devolver 0 registros cuando no hay comerciantes', async () => {
    (prisma.businessman.count as jest.Mock).mockResolvedValue(0);
    (prisma.businessman.findMany as jest.Mock).mockResolvedValue([]);

    const result = await service.findAll(1, 5);

    expect(result.totalRecords).toBe(0);
    expect(result.data).toEqual([]);
  });
});
