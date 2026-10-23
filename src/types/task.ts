export type TaskCategory = 
  | 'Ingeniería de Software' 
  | 'Inteligencia Artificial' 
  | 'Bases de Datos' 
  | 'Redes y Seguridad' 
  | 'Gestión de Proyectos' 
  | 'Trabajo de Grado';

export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada';

export type TaskPriority = 'baja' | 'media' | 'alta' | 'urgente';

export interface UnadTask {
  id: string;
  title: string;
  student_name: string;
  category: string;
  status: TaskStatus | string;
  priority: TaskPriority | string;
  data_consent: boolean;
  created_at: string;
}

export type CreateUnadTaskInput = {
  title: string;
  student_name: string;
  category: string;
  status?: TaskStatus | string;
  priority?: TaskPriority | string;
  data_consent: boolean;
};
