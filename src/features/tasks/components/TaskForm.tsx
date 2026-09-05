import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageIcon, Link2, Upload, X } from 'lucide-react';
import { Button, Input, TextArea, Select } from '@shared/components/ui';
import { cn } from '@shared/utils';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '@shared/constants';
import { taskSchema, type TaskFormData } from '../schemas/task.schema';
import type { Task } from '@shared/types';

interface TaskFormProps {
  task?: Task;
  projectId: string;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusOptions = Object.entries(TASK_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const priorityOptions = Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const MAX_FILE_SIZE = 2 * 1024 * 1024;

type ImageTab = 'url' | 'upload';

export function TaskForm({ task, projectId, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate || null,
      coverImage: task?.coverImage || null,
      projectId: task?.projectId || projectId,
    },
  });

  const [imageTab, setImageTab] = useState<ImageTab>('url');
  const [imageUrl, setImageUrl] = useState(task?.coverImage?.startsWith('http') ? task.coverImage : '');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const coverImage = watch('coverImage');

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    if (url.trim()) {
      setValue('coverImage', url.trim());
    } else {
      setValue('coverImage', null);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadError(null);

    if (!file.type.startsWith('image/')) {
      setUploadError('Le fichier doit être une image (JPG, PNG, WebP)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('L\'image ne doit pas dépasser 2 Mo');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setValue('coverImage', result);
      setImageUrl('');
    };
    reader.onerror = () => setUploadError('Erreur lors de la lecture du fichier');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const removeImage = () => {
    setValue('coverImage', null);
    setImageUrl('');
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Titre de la tâche"
        placeholder="Entrez le titre de la tâche"
        error={errors.title?.message}
        {...register('title')}
      />

      <TextArea
        label="Description"
        placeholder="Que faut-il faire ?"
        error={errors.description?.message}
        {...register('description')}
      />

      <div>
        <label className="label flex items-center gap-1.5">
          <ImageIcon className="h-4 w-4 text-surface-500" />
          Image de couverture
        </label>

        {coverImage ? (
          <div className="relative overflow-hidden rounded-lg border border-surface-200">
            <img
              src={coverImage}
              alt="Aperçu"
              className="h-40 w-full object-cover"
              onError={() => setUploadError('Impossible de charger l\'image (URL invalide)')}
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-1 rounded-lg border border-surface-200 p-1">
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  imageTab === 'url' ? 'bg-brand-50 text-brand-700' : 'text-surface-500 hover:bg-surface-50'
                )}
              >
                <Link2 className="h-3.5 w-3.5" />
                URL
              </button>
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  imageTab === 'upload' ? 'bg-brand-50 text-brand-700' : 'text-surface-500 hover:bg-surface-50'
                )}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload
              </button>
            </div>

            {imageTab === 'url' ? (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://exemple.com/image.jpg"
                className="input"
              />
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-300 bg-surface-50 px-4 py-6 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/50"
              >
                <Upload className="h-6 w-6 text-surface-400" />
                <p className="mt-2 text-sm text-surface-500">
                  Glissez une image ici ou cliquez pour parcourir
                </p>
                <p className="mt-1 text-xs text-surface-400">Max 2 Mo · JPG, PNG, WebP</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {uploadError && (
          <p className="mt-1.5 text-xs text-danger-500">{uploadError}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Statut"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />

        <Select
          label="Priorité"
          options={priorityOptions}
          error={errors.priority?.message}
          {...register('priority')}
        />
      </div>

      <Input
        label="Date d'échéance"
        type="date"
        error={errors.dueDate?.message}
        {...register('dueDate')}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {task ? 'Modifier la tâche' : 'Créer la tâche'}
        </Button>
      </div>
    </form>
  );
}