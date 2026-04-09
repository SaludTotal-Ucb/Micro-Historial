import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateHistorialDto, FiltrosHistorialDto, EvolucionDto } from './dto/historial.dto';

@Injectable()
export class HistorialService {
  constructor(private readonly supabaseService: SupabaseService) {}
  private get db() { return this.supabaseService.getClient(); }

  async create(dto: CreateHistorialDto, userId: string) {
    const { recetas, ...datos } = dto;
    const { data: historial, error } = await this.db
      .from('historiales')
      .insert([{ ...datos, user_id: userId }])
      .select().single();
    
    if (error) throw new Error(error.message);

    if (recetas && recetas.length > 0) {
      const recetasInsert = recetas.map(r => ({ ...r, historial_id: historial.id }));
      await this.db.from('recetas').insert(recetasInsert);
    }
    return historial;
  }

  async findAll(userId: string) {
    const { data, error } = await this.db.from('historiales')
      .select('*, recetas(*), evoluciones(*)').eq('user_id', userId).order('fecha', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async findByPaciente(pacienteId: string, userId: string) {
    // Buscar historial para un paciente particular, retornando array para no romper mapeo.
    try {
      const { data, error } = await this.db.from('historiales')
        .select('*, recetas(*), evoluciones(*)')
        .eq('paciente_id', pacienteId)
        .eq('user_id', userId)
        .order('fecha', { ascending: false });
        
      if (error) {
        console.error('⚠️ Supabase Error en findByPaciente:', error);
        return [];
      }
      return data || [];
    } catch (e) {
      console.error('⚠️ Excepción en findByPaciente:', e);
      return [];
    }
  }

  async findOne(id: string, userId: string) {
    const { data, error } = await this.db.from('historiales')
      .select('*, recetas(*), evoluciones(*)').eq('id', id).eq('user_id', userId).single();
    if (error || !data) throw new NotFoundException('Historial no encontrado');
    return data;
  }

  async filterHistoriales(filtros: FiltrosHistorialDto, userId: string) {
    let query = this.db.from('historiales').select('*, recetas(*)').eq('user_id', userId);
    if (filtros.status) query = query.eq('status', filtros.status);
    if (filtros.severidad) query = query.eq('severidad', filtros.severidad);
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  async obtenerEstadisticas(userId: string) {
    const { data, error } = await this.db.from('historiales').select('diagnostico, severidad, status').eq('user_id', userId);
    if (error) throw new Error(error.message);

    return {
      total: data.length,
      porSeveridad: data.reduce((acc, curr) => { acc[curr.severidad] = (acc[curr.severidad] || 0) + 1; return acc; }, {}),
      porStatus: data.reduce((acc, curr) => { acc[curr.status] = (acc[curr.status] || 0) + 1; return acc; }, {})
    };
  }

  async agregarEvolucion(historialId: string, dto: EvolucionDto, userId: string) {
    await this.findOne(historialId, userId);
    const { data, error } = await this.db.from('evoluciones')
      .insert([{ ...dto, historial_id: historialId }]).select();
    if (error) throw new Error(error.message);
    return data;
  }
}