import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseGuards, Res } from '@nestjs/common';
import { BusinessmanService } from './businessman.service';
import { CreateBusinessmanDto } from './dto/create-businessman.dto';
import { UpdateBusinessmanDto } from './dto/update-businessman.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiTags('Businessman')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('businessman')
export class BusinessmanController {
  constructor(private readonly businessmanService: BusinessmanService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo comerciante' })
  create(@Body() createBusinessmanDto: CreateBusinessmanDto, @Request() req) {
    return this.businessmanService.create(createBusinessmanDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar comerciantes con paginación y filtros' })
  findAll(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 5,
    @Query('filter') filter?: string) {
    return this.businessmanService.findAll(Number(page), Number(pageSize), filter);
  }

  @Get('get/:id')
  @ApiOperation({ summary: 'Obtener comerciante por ID' })
  findOne(@Param('id') id: string) {
    return this.businessmanService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar comerciante' })
  update(@Param('id') id: string, @Body() updateBusinessmanDto: UpdateBusinessmanDto) {
    return this.businessmanService.update(+id, updateBusinessmanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar comerciante (solo ADMIN)' })
  remove(@Param('id') id: string) {
    return this.businessmanService.remove(Number(id));
  }

  @Get('report')
  @ApiOperation({ summary: 'Generar reporte CSV de comerciantes activos (solo ADMIN)' })
  async generateReport(@Request() req, @Res() res: Response) {
    const csvData = await this.businessmanService.generateReportCSV(req.user.role);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="businessman_report.csv"');
    res.send(csvData);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar el estado de un comerciante' })
  async updateStatus(@Param('id') id: number, @Body('status') status: string, @Request() req) {
    return this.businessmanService.updateStatus(Number(id), status, req.user.userId);
  }
}
