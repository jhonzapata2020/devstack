'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnadTask } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Search, Inbox, RefreshCw, Sparkles, Filter } from 'lucide-react';

interface TaskGridProps {
  tasks: UnadTask[];
  isLoading: boolean;
  onToggleStatus: (taskId: string, currentStatus: string) => void;
  onRefresh: () => void;
  updatingTaskId: string | null;
}

export const TaskGrid: React.FC<TaskGridProps> = ({
  tasks,
  isLoading,
  onToggleStatus,
  onRefresh,
  updatingTaskId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' ? true : task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Barra de Filtros, Búsqueda y Herramientas con Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 backdrop-blur-md bg-slate-900/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800/80 shadow-xl"
      >
        {/* Input de Búsqueda */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, estudiante o línea de investigación..."
            className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0078b8] transition"
          />
        </div>

        {/* Filtros de Estado con microinteracciones */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setStatusFilter('todos')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === 'todos'
                  ? 'bg-gradient-to-r from-[#005691] to-[#0078b8] text-white shadow-md shadow-[#005691]/30 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas ({tasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('pendiente')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === 'pendiente'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setStatusFilter('en_progreso')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === 'en_progreso'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              En Desarrollo
            </button>
            <button
              onClick={() => setStatusFilter('completada')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === 'completada'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Completadas
            </button>
          </div>

          {/* Botón de Sincronización / Refrescar */}
          <motion.button
            whileTap={{ rotate: 180, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/90 transition shadow-md"
            title="Sincronizar con Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Grid de Contenedor de Tareas */}
      {isLoading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-52 rounded-2xl backdrop-blur-md bg-slate-900/40 border border-slate-800/80 animate-pulse p-6 space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-4 bg-slate-800 rounded-md w-1/3" />
                <div className="h-4 bg-slate-800 rounded-md w-1/5" />
              </div>
              <div className="h-6 bg-slate-800 rounded-md w-4/5" />
              <div className="h-4 bg-slate-800 rounded-md w-1/2" />
              <div className="h-10 bg-slate-800 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-md bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center shadow-xl"
        >
          <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 shadow-inner">
            <Inbox className="w-7 h-7 text-amber-400/80" />
          </div>
          <h3 className="text-base font-bold text-slate-200">
            No se encontraron actividades registradas
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1.5 leading-relaxed">
            {searchTerm || statusFilter !== 'todos'
              ? 'No hay actividades curriculares que coincidan con los criterios de búsqueda o filtrado.'
              : 'Utiliza el formulario de la parte superior para ingresar el primer entregable formativo.'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={onToggleStatus}
                isUpdating={updatingTaskId === task.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
