import { useState, useEffect } from 'react';
import { Search, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppStore, Notification, TaskPriority, TaskStatus, Task, Project } from '@/store/appStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatRelativeTime } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export const AppHeader = ({ title, subtitle }: AppHeaderProps) => {
  const { addTask, projects, tasks, setSidebarOpen } = useAppStore();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProject, setTaskProject] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [searchResults, setSearchResults] = useState<{ tasks: Task[]; projects: Project[] }>({ tasks: [], projects: [] });
  const navigate = useNavigate();

  // Filter search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ tasks: [], projects: [] });
      return;
    }

    const filteredTasks = tasks.filter((task) =>
      task &&
      (task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.tags && Array.isArray(task.tags) && task.tags.some(tag => tag && typeof tag === 'string' && tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const filteredProjects = projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults({ tasks: filteredTasks, projects: filteredProjects });
  }, [searchQuery, tasks, projects]);





  const handleCreateTask = () => {
    if (!taskTitle.trim()) return;

    const projectId = taskProject ? projects.find(p => p.name === taskProject)?.id || '' : '';

    addTask({
      title: taskTitle,
      description: '',
      status: 'todo' as TaskStatus,
      priority: 'medium' as TaskPriority,
      projectId,
      tags: [],
      dueDate: taskDueDate ? new Date(taskDueDate) : undefined,
    });

    // Reset form
    setTaskTitle('');
    setTaskProject('');
    setTaskDueDate('');
    setIsCreateTaskOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Popover open={!!searchQuery.trim()}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search tasks, projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-9 bg-secondary border-0 focus-visible:ring-1"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                {(searchResults.tasks.length > 0 || searchResults.projects.length > 0) ? (
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.tasks.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
                          Tasks ({searchResults.tasks.length})
                        </div>
                        {searchResults.tasks.slice(0, 5).map((task) => (
                          <div
                            key={task.id}
                            onClick={() => {
                              navigate('/board');
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{task.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {projects.find(p => p.id === task.projectId)?.name || 'No Project'}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {task.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchResults.projects.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border">
                          Projects ({searchResults.projects.length})
                        </div>
                        {searchResults.projects.slice(0, 5).map((project) => (
                          <div
                            key={project.id}
                            onClick={() => {
                              navigate('/projects');
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer border-b border-border/50 last:border-b-0"
                          >
                            <span className="text-lg">{project.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{project.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{project.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {project.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No results found for "{searchQuery}"
                  </div>
                ) : null}
              </PopoverContent>
            </Popover>
          </div>

          {/* New Task Button */}
          <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setIsCreateTaskOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
          </Button>


        </div>
      </header>

      {/* Create Task Dialog */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
        <DialogContent className="sm:max-w-md bg-background opacity-100 text-foreground">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
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
    </>
  );
};
