import { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/store/appStore';
import { useAppStore } from '@/store/appStore';
import { TaskCard } from './TaskCard';
import { statusConfig } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  searchQuery: string;
}

export const KanbanColumn = ({ status, tasks, searchQuery }: KanbanColumnProps) => {
  const { addTask, projects } = useAppStore();
  const config = statusConfig[status];
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProject, setTaskProject] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskDueDate, setTaskDueDate] = useState('');

  const handleCreateTask = () => {
    if (!taskTitle.trim()) return;

    const projectId = taskProject ? projects.find(p => p.name === taskProject)?.id || '' : '';

    addTask({
      title: taskTitle,
      description: '',
      status,
      priority: taskPriority,
      projectId,
      tags: [],
      dueDate: taskDueDate ? new Date(taskDueDate) : undefined,
    });

    // Reset form
    setTaskTitle('');
    setTaskProject('');
    setTaskDueDate('');
    setTaskPriority('medium');
    setIsCreateTaskOpen(false);
  };

  return (
    <div className="flex flex-col min-w-[250px] md:min-w-[300px] max-w-[250px] md:max-w-[300px] snap-start">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={cn('h-3 w-3 rounded-full', config.color)} />
          <h3 className="font-medium text-sm text-foreground">{config.label}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsCreateTaskOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Column Content */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 space-y-3 p-2 rounded-xl transition-colors min-h-[200px]',
              snapshot.isDraggingOver
                ? 'bg-primary/5 border-2 border-dashed border-primary/30'
                : 'bg-muted/30'
            )}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} isDragging={snapshot.isDragging} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {/* Empty State */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No tasks match your search' : 'No tasks'}
                </p>
                {!searchQuery && (
                  <Button variant="ghost" size="sm" className="mt-2 gap-1" onClick={() => setIsCreateTaskOpen(true)}>
                    <Plus className="h-3 w-3" />
                    Add task
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Create Task Dialog */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <DialogContent className="sm:max-w-md bg-background opacity-100 text-foreground">
          <DialogHeader>
            <DialogTitle>Create New Task in {config.label}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <Input
              placeholder="Project (optional)"
              value={taskProject}
              onChange={(e) => setTaskProject(e.target.value)}
            />
            <Select value={taskPriority} onValueChange={(value: TaskPriority) => setTaskPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsCreateTaskOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="gradient-primary"
              onClick={handleCreateTask}
              disabled={!taskTitle.trim()}
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
