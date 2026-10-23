'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UnadTask } from '@/types/task';
import { 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  User, 
  Tag, 
  ShieldCheck, 
  Calendar, 
  ArrowRightCircle,
  Sparkles
} from 'lucide-react';

interface TaskCardProps {
  task: UnadTask;
  onToggleStatus: (taskId: string, currentStatus: string) => void;
  isUpdating?: boolean;
}

// Estilos dinámicos para el botón / selector de estado con transiciones suaves
const statusConfigs: Record<string, {
  bg: string;
  text: string;
  border: string;
  shadow: string;
  glow: string;
  label: string;
  icon: any;
}> = {
  pendiente: {
    bg: 'bg-slate-800/80 hover:bg-slate-750',
    text: 'text-sky-200',
    border: 'border-slate-700/80 hover:border-sky-500/50',
    shadow: 'shadow-slate-900/40',
    glow: 'hover:shadow-[0_0_15px_rgba(0,120,184,0.25)]',
    label: 'Pendiente',
    icon: Clock,
  },
  en_progreso: {
    bg: 'bg-amber-950/60 hover:bg-amber-900/50',
    text: 'text-amber-300',
    border: 'border-amber-600/50 hover:border-amber-400/70',
    shadow: 'shadow-amber-950/30',
    glow: 'hover:shadow-[0_0_20px_rgba(243,146,0,0.3)]',
    label: 'En Desarrollo',
    icon: RotateCcw,
  },
  completada: {
    bg: 'bg-emerald-950/60 hover:bg-emerald-900/50',
    text: 'text-emerald-300',
    border: 'border-emerald-600/50 hover:border-emerald-400/70',
    shadow: 'shadow-emerald-950/30',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
    label: 'Completada',
    icon: CheckCircle2,
  },
};

const priorityStyles: Record<string, { badge: string; dot: string; label: string }> = {
  baja: { badge: 'bg-slate-800/90 text-slate-300 border-slate-700', dot: 'bg-emerald-400', label: 'Baja' },
  media: { badge: 'bg-slate-800/90 text-slate-300 border-slate-700', dot: 'bg-amber-400', label: 'Media' },
  alta: { badge: 'bg-slate-800/90 text-slate-300 border-slate-700', dot: 'bg-orange-400', label: 'Alta' },
  urgente: { badge: 'bg-rose-950/70 text-rose-300 border-rose-800/80', dot: 'bg-rose-400', label: 'Urgente' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleStatus, isUpdating }) => {
  const currentStatusConfig = statusConfigs[task.status] || statusConfigs.pendiente;
  const currentPriorityConfig = priorityStyles[task.priority] || priorityStyles.media;
  const StatusIcon = currentStatusConfig.icon;

  const formattedDate = task.created_at
    ? new Date(task.created_at).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Reciente';

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative backdrop-blur-md bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 shadow-xl hover:shadow-2xl hover:shadow-[#005691]/15 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 overflow-hidden"
    >
      {/* Sutil halo de luz en la esquina de la tarjeta al hacer hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-500/10 via-amber-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div>
        {/* Fila superior: Categoría & Prioridad */}
        <div className="flex items-center justify-between gap-2 mb-3.5 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/70 text-slate-300 border border-slate-700/60 backdrop-blur-sm">
            <Tag className="w-3 h-3 text-amber-400" />
            <span className="truncate max-w-[140px]">{task.category}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium border backdrop-blur-sm ${currentPriorityConfig.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${currentPriorityConfig.dot}`} />
            <span>{currentPriorityConfig.label}</span>
          </span>
        </div>

        {/* Título de la tarea */}
        <h3 className="font-semibold text-base text-white group-hover:text-amber-300 transition-colors duration-200 line-clamp-2 mb-2.5 leading-snug relative z-10">
          {task.title}
        </h3>

        {/* Información del Estudiante Responsable */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 relative z-10">
          <div className="w-5 h-5 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 shrink-0">
            <User className="w-3 h-3" />
          </div>
          <span className="truncate font-medium text-slate-300">{task.student_name}</span>
        </div>
      </div>

      {/* Sección inferior: Metadatos y Acción de Alternar Estado con Transición Suave de Color */}
      <div className="pt-3.5 border-t border-slate-800/80 mt-2 space-y-3 relative z-10">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Calendar className="w-3 h-3 text-slate-500" />
            {formattedDate}
          </span>

          {task.data_consent && (
            <span
              className="inline-flex items-center gap-1 text-emerald-400 font-semibold"
              title="Consentimiento de datos certificado Ley 1581"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ley 1581 OK</span>
            </span>
          )}
        </div>

        {/* Selector / Botón interactivo de cambio de estado con micro-animación whileTap */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onToggleStatus(task.id, task.status)}
          disabled={isUpdating}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border backdrop-blur-md transition-all duration-300 ${currentStatusConfig.bg} ${currentStatusConfig.text} ${currentStatusConfig.border} ${currentStatusConfig.shadow} ${currentStatusConfig.glow} disabled:opacity-50 cursor-pointer`}
          title="Clic para avanzar el estado del ciclo formativo"
        >
          <div className="flex items-center gap-2">
            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
            <span>Estado: {currentStatusConfig.label}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] opacity-75 group-hover:opacity-100 transition-opacity">
            <span className="font-bold">Avanzar</span>
            <ArrowRightCircle className="w-3.5 h-3.5" />
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};
