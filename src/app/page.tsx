'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Stats } from '@/components/Stats';
import { TaskForm } from '@/components/TaskForm';
import { TaskGrid } from '@/components/TaskGrid';
import { UnadTask, CreateUnadTaskInput } from '@/types/task';
import { getTasks, createTask, toggleTaskStatus } from '@/lib/supabase';
import { AlertCircle, Info, Sparkles, ShieldCheck } from 'lucide-react';

// Semilla de demostración visual si Supabase aún no tiene la tabla creada
const DEMO_SEED_TASKS: UnadTask[] = [
  {
    id: 'demo-1',
    title: 'Diseño de microservicios e integración continua con GitHub Actions',
    student_name: 'Jhon Zapata (Ingeniería de Sistemas)',
    category: 'Ingeniería de Software',
    status: 'en_progreso',
    priority: 'alta',
    data_consent: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Modelado predictivo de deserción estudiantil con Redes Neuronales',
    student_name: 'María Fernanda Gómez (Semillero IA)',
    category: 'Inteligencia Artificial',
    status: 'completada',
    priority: 'urgente',
    data_consent: true,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Auditoría de políticas RBAC y protección de datos según Ley 1581',
    student_name: 'Carlos Alberto Ríos (Seguridad Informática)',
    category: 'Redes y Seguridad',
    status: 'pendiente',
    priority: 'media',
    data_consent: true,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export default function HomePage() {
  const [tasks, setTasks] = useState<UnadTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUsingDemoFallback, setIsUsingDemoFallback] = useState<boolean>(false);

  // Verificar si la key no es el placeholder genérico
  const isSupabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'tu_publishable_key_aqui';

  // 1. Cargar tareas (SELECT)
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await getTasks();

    if (error || !data) {
      console.warn('Cargando datos con fallback de demostración:', error);
      setIsUsingDemoFallback(true);
      setTasks(DEMO_SEED_TASKS);
      if (error && isSupabaseConfigured) {
        setErrorMessage(`Aviso Supabase: ${error}. Mostrando datos locales interactivos.`);
      }
    } else {
      setIsUsingDemoFallback(false);
      setTasks(data);
    }

    setLoading(false);
  }, [isSupabaseConfigured]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 2. Crear nueva tarea con validación Ley 1581 (INSERT)
  const handleCreateTask = async (taskInput: CreateUnadTaskInput): Promise<boolean> => {
    setIsSubmitting(true);
    setErrorMessage(null);

    // Si estamos en modo de demostración local o la clave es un placeholder
    if (isUsingDemoFallback || !isSupabaseConfigured) {
      const newTask: UnadTask = {
        id: `local-${Date.now()}`,
        title: taskInput.title,
        student_name: taskInput.student_name,
        category: taskInput.category,
        status: taskInput.status || 'pendiente',
        priority: taskInput.priority || 'media',
        data_consent: taskInput.data_consent,
        created_at: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      setIsSubmitting(false);
      return true;
    }

    // Insertar en Supabase
    const { data, error } = await createTask(taskInput);

    if (error || !data) {
      setErrorMessage(`Error al persistir en Supabase: ${error}`);
      setIsSubmitting(false);
      return false;
    }

    setTasks((prev) => [data, ...prev]);
    setIsSubmitting(false);
    return true;
  };

  // 3. Alternar estado de tarea (UPDATE)
  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    setUpdatingTaskId(taskId);

    const statusCycle: Record<string, string> = {
      pendiente: 'en_progreso',
      en_progreso: 'completada',
      completada: 'pendiente',
    };
    const nextStatus = statusCycle[currentStatus.toLowerCase()] || 'pendiente';

    // Si estamos en fallback local
    if (isUsingDemoFallback || !isSupabaseConfigured) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
      );
      setUpdatingTaskId(null);
      return;
    }

    // Actualizar en Supabase
    const { data, error } = await toggleTaskStatus(taskId, currentStatus);

    if (error || !data) {
      setErrorMessage(`No se pudo actualizar el estado: ${error}`);
    } else {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? data : t))
      );
    }

    setUpdatingTaskId(null);
  };

  return (
    <div className="min-h-screen unad-bg-mesh text-slate-100 flex flex-col relative selection:bg-amber-500 selection:text-slate-950">
      
      {/* Orbes de Iluminación Ambiental (Ambient Glow) */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#005691]/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-10 w-[28rem] h-[28rem] bg-indigo-900/15 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-72 h-72 bg-[#f39200]/8 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* 1. Header con Glassmorphism */}
      <Header isConfigured={isSupabaseConfigured && !isUsingDemoFallback} totalTasks={tasks.length} />

      {/* Main Content Area con Staggered Motion */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Informativo si se usa la clave de demostración */}
        {!isSupabaseConfigured && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl backdrop-blur-md bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-semibold text-amber-300">
                  Infraestructura activa en modo local interactivo
                </p>
                <p className="text-amber-200/80 text-[11px] mt-0.5">
                  Conexión Supabase enlazada con la base de datos de UNAD DevTrack. Si no has ejecutado el esquema SQL, ejecuta <code className="bg-amber-900/60 px-1 py-0.5 rounded text-amber-100">supabase/schema.sql</code> en el editor de Supabase.
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] uppercase font-bold tracking-wider">
                Modo Demo OK
              </span>
            </div>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl backdrop-blur-md bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-3 shadow-lg"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* 2. Estadísticas Modulares con Glassmorphism y Staggered Motion */}
        <Stats tasks={tasks} />

        {/* 3. Formulario con Validación Ley 1581, Confetti y Microinteracciones */}
        <section aria-label="Registro de Tareas">
          <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
        </section>

        {/* 4. Grid de Tareas con Trazabilidad y Acciones */}
        <section aria-label="Listado de Tareas de Ingeniería" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Tablero de Control Curricular &amp; Proyectos
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {tasks.length} {tasks.length === 1 ? 'actividad' : 'actividades'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Seguimiento de estados formativos y cumplimiento legal de Habeas Data.
              </p>
            </div>
          </div>

          <TaskGrid
            tasks={tasks}
            isLoading={loading}
            onToggleStatus={handleToggleStatus}
            onRefresh={fetchTasks}
            updatingTaskId={updatingTaskId}
          />
        </section>
      </main>

      {/* Footer Institucional con Glassmorphism */}
      <footer className="border-t border-slate-900/80 bg-slate-950/60 backdrop-blur-md py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Universidad Nacional Abierta y a Distancia (UNAD)</span>
            <span>&bull;</span>
            <span className="text-slate-500">ECBTI</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/70" />
            <span>UNAD DevTrack &bull; Sistema Certificado bajo Ley 1581 de 2012</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
