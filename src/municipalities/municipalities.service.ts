import { Injectable } from '@nestjs/common';
import { createCache, Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MunicipalitiesService {
  private cache: Cache;
  
  
  constructor(private prisma: PrismaService) {
    this.cache = createCache({ ttl: 60 * 1000 }); 
  }

  async findAll() {
    const cachedData = await this.cache.get('municipalities');
    if (cachedData) return cachedData;

    const municipalities = await this.prisma.municipality.findMany({ orderBy: { name: 'asc' } });
    await this.cache.set('municipalities', municipalities);
    return municipalities;
  }
}
