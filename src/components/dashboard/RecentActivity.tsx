import { useAppStore } from '@/store/appStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, getInitials, priorityConfig, statusConfig } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';

export const RecentActivity = () => {
  const { tasks } = useAppStore();
  
  // Get recent tasks sorted by update time
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>

      <div className="space-y-4">
        {recentTasks.map((task, index) => (
          <div
            key={task.id}
            className="flex items-start gap-3 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {task.assignee ? (
              <Avatar className="h-9 w-9">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(task.assignee.name)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">?</span>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatRelativeTime(task.updatedAt)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn('h-2 w-2 rounded-full', statusConfig[task.status].color)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {statusConfig[task.status].label}
                  </span>
                </div>
                
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-[10px] px-1.5 py-0',
                    priorityConfig[task.priority].bgColor,
                    priorityConfig[task.priority].color
                  )}
                >
                  {priorityConfig[task.priority].label}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
