import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { HistorialModule } from './modules/historial/historial.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    SupabaseModule,
    HistorialModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}