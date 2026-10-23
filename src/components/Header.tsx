'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, GraduationCap } from 'lucide-react';

interface HeaderProps {
  isConfigured: boolean;
  totalTasks: number;
}

export const Header: React.FC<HeaderProps> = ({ isConfigured, totalTasks }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 shadow-lg shadow-black/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Identidad de Marca UNAD DevTrack */}
          <div className="flex items-center space-x-3.5">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#005691] via-[#0078b8] to-[#f39200] p-0.5 shadow-lg shadow-[#005691]/30 ring-1 ring-white/20"
            >
              <div className="w-full h-full bg-slate-950/40 rounded-[10px] backdrop-blur-sm flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white drop-shadow" />
              </div>
            </motion.div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-200 to-sky-300">
                  UNAD
                </span>
                <span className="text-xl font-bold tracking-tight text-white">
                  DevTrack
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-950/80 text-sky-400 border border-sky-800/80 shadow-sm">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Plataforma de Trazabilidad &amp; Gestión Curricular de Ingeniería
              </p>
            </div>
          </div>

          {/* Badges de Estado y Cumplimiento con Microinteracción */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Badge Ley 1581 (Habeas Data) */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-700/50 text-emerald-300 text-xs font-medium shadow-sm shadow-emerald-950/40 backdrop-blur-md cursor-default"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Habeas Data Ley 1581</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>

            {/* Badge Estado Supabase */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium backdrop-blur-md shadow-sm cursor-default ${
                isConfigured 
                  ? 'bg-sky-950/50 border-sky-700/60 text-sky-300 shadow-sky-950/40' 
                  : 'bg-amber-950/50 border-amber-700/60 text-amber-300 shadow-amber-950/40'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isConfigured ? 'Supabase Activo' : 'Supabase Demo'}</span>
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]' : 'bg-amber-400'}`} />
            </motion.div>
          </div>

        </div>
      </div>
    </motion.header>
  );
};
