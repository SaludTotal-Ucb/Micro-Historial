import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { CreateHistorialDto, FiltrosHistorialDto, EvolucionDto } from './dto/historial.dto';
import { GetUserId } from '../../common/decorators/get-user-id.decorator';

@Controller('historial')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Post()
  create(@Body() dto: CreateHistorialDto, @GetUserId() userId: string) {
    return this.historialService.create(dto, userId);
  }

  @Get()
  findAll(@GetUserId() userId: string) {
    return this.historialService.findAll(userId);
  }

  @Post('filtrar')
  filter(@Body() filtros: FiltrosHistorialDto, @GetUserId() userId: string) {
    return this.historialService.filterHistoriales(filtros, userId);
  }

  @Get('estadisticas/data')
  getStats(@GetUserId() userId: string) {
    return this.historialService.obtenerEstadisticas(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUserId() userId: string) {
    return this.historialService.findOne(id, userId);
  }

  @Patch(':id/evolucion')
  addEvolucion(@Param('id') id: string, @Body() dto: EvolucionDto, @GetUserId() userId: string) {
    return this.historialService.agregarEvolucion(id, dto, userId);
  }
}