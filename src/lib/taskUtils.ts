import { TaskPriority, TaskStatus } from '@/store/appStore';

export const priorityConfig: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Low', color: 'text-muted-foreground', bgColor: 'bg-muted' },
  medium: { label: 'Medium', color: 'text-info', bgColor: 'bg-info/10' },
  high: { label: 'High', color: 'text-warning', bgColor: 'bg-warning/10' },
  urgent: { label: 'Urgent', color: 'text-destructive', bgColor: 'bg-destructive/10' },
};

export const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-muted-foreground' },
  todo: { label: 'To Do', color: 'bg-info' },
  in_progress: { label: 'In Progress', color: 'bg-warning' },
  review: { label: 'Review', color: 'bg-primary' },
  done: { label: 'Done', color: 'bg-success' },
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
