'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { UnadTask } from '@/types/task';
import { Layers, Clock, Activity, CheckCircle2, ShieldCheck } from 'lucide-react';

interface StatsProps {
  tasks: UnadTask[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const Stats: React.FC<StatsProps> = ({ tasks }) => {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === 'pendiente').length;
  const inProgress = tasks.filter((t) => t.status === 'en_progreso').length;
  const completed = tasks.filter((t) => t.status === 'completada').length;
  const consentGranted = tasks.filter((t) => t.data_consent).length;
  const consentPercentage = total > 0 ? Math.round((consentGranted / total) * 100) : 100;

  const statsCards = [
    {
      title: 'Total Tareas',
      count: total,
      label: 'Registradas en la red',
      icon: Layers,
      glowHover: 'group-hover:border-sky-500/50 group-hover:shadow-[0_0_25px_rgba(0,120,184,0.25)]',
      gradient: 'from-sky-500/10 via-slate-900/40 to-slate-950/60',
      iconColor: 'text-sky-400',
      iconBg: 'bg-sky-950/80 border-sky-800/60',
    },
    {
      title: 'Pendientes',
      count: pending,
      label: 'Por iniciar ciclo',
      icon: Clock,
      glowHover: 'group-hover:border-amber-500/50 group-hover:shadow-[0_0_25px_rgba(243,146,0,0.25)]',
      gradient: 'from-amber-500/10 via-slate-900/40 to-slate-950/60',
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-950/80 border-amber-800/60',
    },
    {
      title: 'En Desarrollo',
      count: inProgress,
      label: 'En ejecución activa',
      icon: Activity,
      glowHover: 'group-hover:border-blue-500/50 group-hover:shadow-[0_0_25px_rgba(0,86,145,0.25)]',
      gradient: 'from-blue-500/10 via-slate-900/40 to-slate-950/60',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-950/80 border-blue-800/60',
    },
    {
      title: 'Completadas',
      count: completed,
      label: 'Entregables validados',
      icon: CheckCircle2,
      glowHover: 'group-hover:border-emerald-500/50 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      gradient: 'from-emerald-500/10 via-slate-900/40 to-slate-950/60',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-950/80 border-emerald-800/60',
    },
    {
      title: 'Ley 1581 (Datos)',
      count: `${consentPercentage}%`,
      label: `${consentGranted}/${total} con consentimiento`,
      icon: ShieldCheck,
      glowHover: 'group-hover:border-indigo-500/50 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]',
      gradient: 'from-indigo-500/10 via-slate-900/40 to-slate-950/60',
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-950/80 border-indigo-800/60',
    },
  ];

  return (
    <section className="w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4"
      >
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className={`group relative overflow-hidden backdrop-blur-md bg-slate-900/60 border border-slate-800/80 shadow-2xl rounded-2xl p-4 sm:p-5 transition-all duration-300 ${stat.glowHover}`}
            >
              {/* Resplandor decorativo de esquina */}
              <div
                className={`absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-full blur-xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`}
              />

              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl border ${stat.iconBg} shadow-inner`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </div>

              <div className="relative z-10">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stat.count}
                </span>
                <p className="mt-1 text-[11px] text-slate-400 font-medium truncate">
                  {stat.label}
                </p>
              </div>

              {/* Barra de progreso decorativa inferior */}
              <div className="mt-3 w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-amber-400 to-[#005691] rounded-full transition-all duration-500`}
                  style={{
                    width:
                      stat.title.includes('Ley')
                        ? `${consentPercentage}%`
                        : total > 0
                        ? `${Math.min(100, Math.round(((Number(stat.count) || 1) / total) * 100))}%`
                        : '0%',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};
