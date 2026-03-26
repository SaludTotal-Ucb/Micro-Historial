import { Injectable, NotFoundException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreateHistorialDto, FiltrosHistorialDto, EvolucionDto } from './dto/historial.dto';

@Injectable()
export class HistorialService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
  }

  async create(createDto: CreateHistorialDto, userId: string) {
    const { recetas, ...datosHistorial } = createDto;

    const { data: historial, error } = await this.supabase
      .from('historiales')
      .insert([{ ...datosHistorial, user_id: userId }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    if (recetas && recetas.length > 0) {
      const recetasData = recetas.map(r => ({ ...r, historial_id: historial.id }));
      await this.supabase.from('recetas').insert(recetasData);
    }

    return historial;
  }

  async findAll(userId: string) {
    const { data, error } = await this.supabase
      .from('historiales')
      .select('*, recetas(*), evoluciones(*)')
      .eq('user_id', userId)
      .order('fecha', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }


  async filterHistoriales(filtros: FiltrosHistorialDto, userId: string) {
    let query = this.supabase
      .from('historiales')
      .select('*, recetas(*)')
      .eq('user_id', userId);

    if (filtros.status) query = query.eq('status', filtros.status);
    if (filtros.severidad) query = query.eq('severidad', filtros.severidad);
    
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }


  async agregarEvolucion(id: string, evolucionDto: EvolucionDto) {
    const { data, error } = await this.supabase
      .from('evoluciones')
      .insert([{ ...evolucionDto, historial_id: id }])
      .select();

    if (error) throw new Error(error.message);
    return data;
  }


  async obtenerEstadisticas(userId: string) {
    const { data, error } = await this.supabase
      .from('historiales')
      .select('diagnostico, severidad, status')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);

    return {
      total: data.length,
      severidad: this.contar(data, 'severidad'),
      estados: this.contar(data, 'status')
    };
  }

  private contar(items: any[], campo: string) {
    return items.reduce((acc, obj) => {
      acc[obj[campo]] = (acc[obj[campo]] || 0) + 1;
      return acc;
    }, {});
  }
}