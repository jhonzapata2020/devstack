'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CreateUnadTaskInput, TaskCategory, TaskPriority } from '@/types/task';
import { 
  PlusCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Award,
  Lock,
  ChevronDown
} from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: CreateUnadTaskInput) => Promise<boolean>;
  isSubmitting: boolean;
}

const CATEGORIES: TaskCategory[] = [
  'Ingeniería de Software',
  'Inteligencia Artificial',
  'Bases de Datos',
  'Redes y Seguridad',
  'Gestión de Proyectos',
  'Trabajo de Grado',
];

const PRIORITIES: { label: string; value: TaskPriority; color: string; dot: string }[] = [
  { label: 'Baja', value: 'baja', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  { label: 'Media', value: 'media', color: 'text-amber-400', dot: 'bg-amber-400' },
  { label: 'Alta', value: 'alta', color: 'text-orange-400', dot: 'bg-orange-400' },
  { label: 'Urgente', value: 'urgente', color: 'text-rose-400', dot: 'bg-rose-400' },
];

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [studentName, setStudentName] = useState('');
  const [category, setCategory] = useState<string>('Ingeniería de Software');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [dataConsent, setDataConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Disparo de ráfaga de confeti con paleta institucional UNAD
  const triggerUnadConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#005691', '#f39200', '#0078b8', '#ffb81c', '#ffffff'],
      disableForReducedMotion: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Validación obligatoria Ley 1581
    if (!dataConsent) {
      setConsentError(true);
      setGeneralError('⚠️ Cumplimiento obligatorio: Debe autorizar el tratamiento de datos (Ley 1581) para guardar la tarea.');
      return;
    }

    if (!title.trim() || !studentName.trim()) {
      setGeneralError('Por favor complete todos los campos obligatorios del formulario.');
      return;
    }

    setConsentError(false);

    const success = await onSubmit({
      title: title.trim(),
      student_name: studentName.trim(),
      category,
      priority,
      status: 'pendiente',
      data_consent: true,
    });

    if (success) {
      // Éxito: Disparar confeti y feedback interactivo
      triggerUnadConfetti();
      setTitle('');
      setStudentName('');
      setDataConsent(false);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  };

  return (
    <div className="relative">
      {/* Toast Flotante Animado con Framer Motion */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl backdrop-blur-xl bg-slate-900/90 border border-emerald-500/50 shadow-2xl shadow-emerald-950/60 text-white"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                ¡Tarea Registrada con Éxito!
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </p>
              <p className="text-[11px] text-emerald-300/90">
                Consentimiento Ley 1581 verificado &amp; sincronizado en UNAD DevTrack.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor Principal con Glassmorphism y Glow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="group relative backdrop-blur-md bg-slate-900/60 border border-slate-800/80 shadow-2xl rounded-2xl p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:border-slate-700/80 hover:shadow-[0_20px_45px_-10px_rgba(0,86,145,0.2)]"
      >
        {/* Glow degradado sutil UNAD en la esquina superior */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#005691]/20 via-[#f39200]/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        {/* Barra de acento con gradiente institucional */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005691] via-amber-400 to-[#f39200]" />

        {/* Encabezado del Formulario */}
        <div className="mb-6 flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              Registrar Nueva Actividad Académica
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Ingresa entregables curriculares con trazabilidad y estricta validez legal.
            </p>
          </div>
        </div>

        {/* Errores con animación */}
        <AnimatePresence>
          {generalError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-700/60 text-rose-300 text-xs flex items-center gap-2.5 backdrop-blur-md"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{generalError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Título de la tarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Título del Entregable / Tarea <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Implementar arquitectura de datos para tesis de grado"
                className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0078b8] focus:border-transparent transition duration-200 shadow-inner"
                required
              />
            </div>

            {/* Nombre del Estudiante */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Estudiante / Desarrollador Responsable <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Ej. Jhon Zapata (Ingeniería de Sistemas)"
                className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0078b8] focus:border-transparent transition duration-200 shadow-inner"
                required
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Categoría */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Línea de Formación / Categoría
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0078b8] focus:border-transparent transition duration-200 shadow-inner cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nivel de Prioridad
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full appearance-none bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#0078b8] focus:border-transparent transition duration-200 shadow-inner cursor-pointer"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* CONTENEDOR DE VALIDACIÓN OBLIGATORIA LEY 1581 (HABEAS DATA) */}
          <motion.div
            animate={{
              borderColor: consentError ? 'rgba(225, 29, 72, 0.8)' : dataConsent ? 'rgba(16, 185, 129, 0.6)' : 'rgba(51, 65, 85, 0.7)',
            }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${
              consentError
                ? 'bg-rose-950/30 shadow-[0_0_20px_rgba(225,29,72,0.15)]'
                : dataConsent
                ? 'bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                : 'bg-slate-950/50 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="data-consent-checkbox"
                  type="checkbox"
                  checked={dataConsent}
                  onChange={(e) => {
                    setDataConsent(e.target.checked);
                    if (e.target.checked) setConsentError(false);
                  }}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 focus:ring-2 cursor-pointer transition-transform active:scale-90"
                />
              </div>
              <div className="text-xs">
                <label
                  htmlFor="data-consent-checkbox"
                  className="font-semibold text-slate-200 cursor-pointer select-none flex items-center gap-1.5"
                >
                  Consentimiento de Datos Personales (Ley Estatutaria 1581 de 2012)
                  <span className="text-rose-400">*</span>
                  {dataConsent && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1 text-emerald-400 text-[10px] bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/60 font-bold"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Autorizado
                    </motion.span>
                  )}
                </label>
                <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                  Autorizo voluntariamente a la UNAD el tratamiento seguro de los datos consignados en este registro de desarrollo con fines exclusivamente formativos, evaluativos y académicos.
                </p>
                {consentError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-400 font-semibold text-[11px] mt-1.5 flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Este campo es un requerimiento legal ineludible según la Ley 1581 de Colombia.
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* BOTÓN REGISTRAR TAREA CON ANIMACIÓN DE PULSACIÓN SUAVE (whileTap) */}
          <div className="flex items-center justify-end pt-2">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative group overflow-hidden inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 transition-all duration-200 shadow-xl shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Brillo dinámico en hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Sincronizando con Supabase...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Registrar Tarea Académica</span>
                  <Sparkles className="w-3.5 h-3.5 text-slate-900 opacity-70 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
