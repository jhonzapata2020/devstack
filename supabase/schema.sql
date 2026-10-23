-- ==============================================================================
-- UNAD DevTrack - Esquema de Base de Datos para Supabase
-- Tabla: unad_tasks
-- Cumplimiento: Ley 1581 de 2012 (Protección de Datos Personales de Colombia)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.unad_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  student_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Ingeniería de Software',
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_progreso', 'completada')),
  priority TEXT NOT NULL DEFAULT 'media' CHECK (priority IN ('baja', 'media', 'alta', 'urgente')),
  data_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.unad_tasks ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso (Permitir lectura y creación para demostración)
CREATE POLICY "Permitir lectura pública de tareas UNAD" 
  ON public.unad_tasks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Permitir inserción de tareas con consentimiento" 
  ON public.unad_tasks 
  FOR INSERT 
  WITH CHECK (data_consent = true);

CREATE POLICY "Permitir actualización de estado de tareas" 
  ON public.unad_tasks 
  FOR UPDATE 
  USING (true) 
  WITH CHECK (true);
