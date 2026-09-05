import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import type { Task, TaskStatus } from '@shared/types';
import { TASK_STATUS } from '@shared/constants';
import { useTasksStore } from '../tasks.store';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const COLUMNS: TaskStatus[] = [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE];

export function KanbanBoard({ tasks, onEdit, onDelete }: KanbanBoardProps) {
  const { updateTaskStatusOptimistic, updateTaskStatus } = useTasksStore();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    updateTaskStatusOptimistic(draggableId, newStatus);
    updateTaskStatus(draggableId, newStatus).catch(() => {
      updateTaskStatusOptimistic(draggableId, source.droppableId as TaskStatus);
    });
  };

  const tasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByStatus(status)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </DragDropContext>
  );
}