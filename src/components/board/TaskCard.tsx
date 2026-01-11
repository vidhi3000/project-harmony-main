import { Task, TaskPriority, TaskStatus, useAppStore, dummyUsers } from '@/store/appStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials, priorityConfig } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';
import { CalendarDays, MessageSquare, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,

  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export const TaskCard = ({ task, isDragging }: TaskCardProps) => {
  const { updateTask, deleteTask } = useAppStore();
  const priorityStyle = priorityConfig[task.priority];

  // Edit dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editStatus, setEditStatus] = useState<TaskStatus>(task.status);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [editAssignee, setEditAssignee] = useState(task.assignee?.id || '');
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const [editTags, setEditTags] = useState(task.tags.join(', '));

  const handleEditTask = () => {
    // Reset form with current task data
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
    setEditPriority(task.priority);
    setEditAssignee(task.assignee?.id || '');
    setEditDueDate(task.dueDate || '');
    setEditTags(task.tags.join(', '));
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;

    updateTask(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      status: editStatus,
      priority: editPriority,
      assignee: editAssignee ? dummyUsers.find(u => u.id === editAssignee) : undefined,
      dueDate: editDueDate || undefined,
      tags: editTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    });

    setIsEditOpen(false);
  };

  const handleAssignTo = (userId: string) => {
    const user = dummyUsers.find(u => u.id === userId);
    if (user) {
      updateTask(task.id, { assignee: user });
    }
  };

  const handleSetDueDate = () => {
    const newDate = prompt('Enter new due date (YYYY-MM-DD):', task.dueDate || '');
    if (newDate) {
      updateTask(task.id, { dueDate: newDate });
    }
  };

  const handleDeleteTask = () => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <div
      className={cn(
        'group rounded-lg border border-border bg-card p-3 transition-all duration-200',
        'hover:shadow-md hover:border-primary/30',
        isDragging && 'shadow-lg scale-[1.02] rotate-1 border-primary'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge
          variant="secondary"
          className={cn(
            'text-[10px] px-1.5 py-0 font-medium',
            priorityStyle.bgColor,
            priorityStyle.color
          )}
        >
          {priorityStyle.label}
        </Badge>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEditTask}>Edit Task</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Assign to...</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {dummyUsers.map((user) => (
                  <DropdownMenuItem key={user.id} onClick={() => handleAssignTo(user.id)}>
                    <Avatar className="h-4 w-4 mr-2">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-[8px]">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem onClick={handleSetDueDate}>Set due date</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleDeleteTask}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-2">
        {task.title}
      </h4>

      {/* Description Preview */}
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />
              <span>
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            <span>3</span>
          </div>
        </div>

        {task.assignee && (
          <Avatar className="h-6 w-6 border border-border">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {getInitials(task.assignee.name)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};
