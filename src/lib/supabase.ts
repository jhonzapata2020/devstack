import { createClient } from '@supabase/supabase-js';
import { UnadTask, CreateUnadTaskInput } from '@/types/task';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zciqpcdtklsjeoftirgz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ ADVERTENCIA UNAD DevTrack: Las variables de entorno de Supabase no están completamente configuradas en .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 1. Consultar tareas (SELECT)
 * Retorna la lista de tareas ordenadas por fecha de creación descendente.
 */
export async function getTasks(): Promise<{ data: UnadTask[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('unad_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al consultar tareas (SELECT):', error.message);
      return { data: null, error: error.message };
    }

    return { data: (data as UnadTask[]) || [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido al obtener tareas';
    console.error('Excepción en getTasks:', message);
    return { data: null, error: message };
  }
}

/**
 * 2. Insertar tarea con validación de consentimiento Ley 1581 (INSERT)
 * Requiere estrictamente que data_consent sea true.
 */
export async function createTask(
  taskInput: CreateUnadTaskInput
): Promise<{ data: UnadTask | null; error: string | null }> {
  try {
    // Validación estricta de consentimiento (Ley 1581 de Protección de Datos Personales de Colombia)
    if (!taskInput.data_consent) {
      const errorMsg = 'Error de cumplimiento: Es obligatorio autorizar el tratamiento de datos personales (Ley 1581).';
      console.warn(errorMsg);
      return { data: null, error: errorMsg };
    }

    if (!taskInput.title?.trim() || !taskInput.student_name?.trim()) {
      return { data: null, error: 'El título de la tarea y el nombre del estudiante son obligatorios.' };
    }

    const payload = {
      title: taskInput.title.trim(),
      student_name: taskInput.student_name.trim(),
      category: taskInput.category || 'Ingeniería de Software',
      status: taskInput.status || 'pendiente',
      priority: taskInput.priority || 'media',
      data_consent: true,
    };

    const { data, error } = await supabase
      .from('unad_tasks')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error al insertar tarea (INSERT):', error.message);
      return { data: null, error: error.message };
    }

    return { data: data as UnadTask, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido al insertar tarea';
    console.error('Excepción en createTask:', message);
    return { data: null, error: message };
  }
}

/**
 * 3. Alternar o actualizar estado de la tarea (UPDATE)
 * Cambia cíclicamente: pendiente -> en_progreso -> completada -> pendiente
 * O actualiza al nuevo estado especificado.
 */
export async function toggleTaskStatus(
  taskId: string,
  currentStatus: string
): Promise<{ data: UnadTask | null; error: string | null }> {
  try {
    const statusCycle: Record<string, string> = {
      pendiente: 'en_progreso',
      en_progreso: 'completada',
      completada: 'pendiente',
    };

    const nextStatus = statusCycle[currentStatus.toLowerCase()] || 'pendiente';

    const { data, error } = await supabase
      .from('unad_tasks')
      .update({ status: nextStatus })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar estado de tarea (UPDATE):', error.message);
      return { data: null, error: error.message };
    }

    return { data: data as UnadTask, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido al alternar estado';
    console.error('Excepción en toggleTaskStatus:', message);
    return { data: null, error: message };
  }
}
