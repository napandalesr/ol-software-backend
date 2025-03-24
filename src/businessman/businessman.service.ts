import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBusinessmanDto } from './dto/create-businessman.dto';
import { UpdateBusinessmanDto } from './dto/update-businessman.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createObjectCsvStringifier } from 'csv-writer';
import { Statuses } from '../types/busubessmanTypes';

@Injectable()
export class BusinessmanService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBusinessmanDto, userId: number) {
    if(data.email === "") {
      delete data.email;
    }
    
    return this.prisma.businessman.create({
      data: {
        ...data,
        user: userId,
      },
    });
  }

  async findAll(page: number, pageSize: number, filter?: string) {
    const totalRecords = await this.prisma.businessman.count();
    const data = await this.prisma.businessman.findMany({
      where: filter
        ? {
            OR: [
              { name: { contains: filter, mode: 'insensitive' } },
              { city: { contains: filter, mode: 'insensitive' } },
            ],
          }
        : {},
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { establishments: true },
        },
      }
    })
    return {
      data,
      totalRecords
    }
  }

  async findOne(id: number) {
    const businessman = await this.prisma.businessman.findUnique({
      where: { id },
      include: {
        establishments: {
          select: {
            employees: true,
            income: true,
          },
        },
      },
    });

    if (!businessman) {
      throw new NotFoundException(`No se encontró el comerciante con ID ${id}`);
    }

    // Calcular totales
    const totalEmployees = businessman.establishments.reduce((sum, e) => sum + e.employees, 0);
    const totalIncome = businessman.establishments.reduce((sum, e) => sum + e.income, 0);

    return {
      id: businessman.id,
      name: businessman.name,
      city: businessman.city,
      phone: businessman.phone,
      date: businessman.date,
      email: businessman.email,
      status: businessman.status,
      totalEmployees,
      totalIncome,
    };
  }

  async update(id: number, data: UpdateBusinessmanDto) {
    if(data.email === "") {
      delete data.email;
    }
    return this.prisma.businessman.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.businessman.delete({ where: { id } });
  }

  async generateReportCSV(userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Solo los administradores pueden generar reportes.');
    }

    const businessmen = await this.prisma.businessman.findMany({
      where: { status: 'ACTIVE' },
      include: {
        establishments: true,
        _count: {
          select: { establishments: true },
        },
      },
    });

    const data = businessmen.map((b) => ({
      name: b.name,
      city: b.city,
      phone: b.phone || 'N/A',
      email: b.email || 'N/A',
      createdAt: b.createdAt.toISOString().split('T')[0], 
      status: b.status,
      totalEstablishments: b.establishments.length,
      totalIncome: b.establishments.reduce((sum, e) => sum + e.income, 0),
      totalEmployees: b.establishments.reduce((sum, e) => sum + e.employees, 0),
    }));

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'name', title: 'Nombre' },
        { id: 'city', title: 'Ciudad' },
        { id: 'phone', title: 'Teléfono' },
        { id: 'email', title: 'Correo' },
        { id: 'createdAt', title: 'Fecha Registro' },
        { id: 'status', title: 'Estado' },
        { id: 'totalEstablishments', title: 'Cantidad Establecimientos' },
        { id: 'totalIncome', title: 'Total Ingresos' },
        { id: 'totalEmployees', title: 'Cantidad Empleados' },
      ],
      fieldDelimiter: ';',
    });

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);
    return csvContent;
  }

  async updateStatus(id: number, status: string, updatedBy: number) {
    if (!(status in Statuses)) {
      throw new BadRequestException(`Estado inválido: ${status}`);
    }

    const businessman = await this.prisma.businessman.findUnique({ where: { id } });

    if (!businessman) {
      throw new NotFoundException(`No se encontró el comerciante con ID ${id}`);
    }

    return this.prisma.businessman.update({
      where: { id },
      data: { status: status as Statuses, user: updatedBy },
    });
  }
}
