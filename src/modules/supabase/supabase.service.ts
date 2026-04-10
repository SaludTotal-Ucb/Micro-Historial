import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL as string;
    const supabaseKey =
      (process.env.SUPABASE_SERVICE_ROLE_KEY as string) ||
      (process.env.SUPABASE_KEY as string);

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Faltan variables SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY (o SUPABASE_KEY).',
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Con anon key, RLS suele bloquear inserts server-to-server.
      console.warn(
        '[Historial] SUPABASE_SERVICE_ROLE_KEY no configurada. Con SUPABASE_KEY (anon) los inserts pueden fallar por RLS.',
      );
    }

    this.supabase = createClient(
      supabaseUrl,
      supabaseKey,
    );
  }

  getClient() {
    return this.supabase;
  }
}