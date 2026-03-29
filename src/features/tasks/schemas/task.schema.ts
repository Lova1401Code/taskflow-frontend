import { z } from 'zod';
import { TASK_STATUS, TASK_PRIORITY } from '@shared/constants';

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  status: z.enum([TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE]).default(TASK_STATUS.TODO),
  priority: z.enum([TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH]).default(TASK_PRIORITY.MEDIUM),
  dueDate: z.string().nullable().optional(),
  projectId: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

