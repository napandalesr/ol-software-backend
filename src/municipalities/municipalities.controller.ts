import { Controller, Get, UseGuards } from '@nestjs/common';
import { MunicipalitiesService } from './municipalities.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Municipalities')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('municipalities')
export class MunicipalitiesController {
  constructor(private readonly municipalitiesService: MunicipalitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de municipios' })
  @ApiResponse({ status: 200, description: 'Lista de municipios obtenida con éxito' })
  findAll() {
    return this.municipalitiesService.findAll();
  }
}
