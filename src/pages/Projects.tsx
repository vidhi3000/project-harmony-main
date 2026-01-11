import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { useAppStore, Project } from '@/store/appStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getInitials, formatDate } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  CalendarDays,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  Edit,
} from 'lucide-react';
import { useState } from 'react';

const Projects = () => {
  const { projects, addProject, updateProject, deleteProject, currentUser } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleNewProject = () => {
    addProject({
      name: 'New Project',
      description: 'A new project description',
      color: '#6366f1',
      icon: '📁',
      status: 'active',
      progress: 0,
      tasksCount: 0,
      completedTasks: 0,
      members: [currentUser],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      color: project.color,
      icon: project.icon,
      status: project.status,
      dueDate: project.dueDate,
    });
  };

  const handleSaveEdit = () => {
    if (editingProject && formData) {
      updateProject(editingProject.id, formData);
      setEditingProject(null);
      setFormData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setFormData({});
  };

  return (
    <AppLayout title="Projects" subtitle="Manage and track all your projects">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {(['all', 'active', 'completed', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
                  statusFilter === status
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {status}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button onClick={handleNewProject} className="gap-2 gradient-primary border-0 shadow-glow">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onEdit={handleEditProject} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} onEdit={handleEditProject} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first project'}
          </p>
          <Button className="gap-2 gradient-primary border-0">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Input
                id="color"
                type="color"
                value={formData.color || ''}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Icon
              </Label>
              <Input
                id="icon"
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="col-span-3"
                placeholder="e.g., 📁"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status || ''}
                onValueChange={(value) => setFormData({ ...formData, status: value as Project['status'] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveEdit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

const ProjectCard = ({ project, index, onEdit }: { project: Project; index: number; onEdit: (project: Project) => void }) => {
  const { updateProject, deleteProject } = useAppStore();

  const handleArchiveProject = (projectId: string) => {
    updateProject(projectId, { status: 'archived' });
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
  };

  return (
    <div
      className="rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer animate-slide-up group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
            style={{ backgroundColor: `${project.color}20` }}
          >
            {project.icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <Badge
              variant="secondary"
              className={cn(
                'text-[10px] mt-1',
                project.status === 'active' && 'bg-success/10 text-success',
                project.status === 'completed' && 'bg-primary/10 text-primary',
                project.status === 'archived' && 'bg-muted text-muted-foreground'
              )}
            >
              {project.status}
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(project)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}><Archive className="h-4 w-4 mr-2" /> Archive</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {project.description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span>{project.completedTasks}/{project.tasksCount} tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{formatDate(project.dueDate)}</span>
        </div>
      </div>

      {/* Team */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex -space-x-2">
          {project.members.slice(0, 4).map((member) => (
            <Avatar key={member.id} className="h-7 w-7 border-2 border-card">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
          ))}
          {project.members.length > 4 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-medium">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        <Link to="/board">
          <Button variant="ghost" size="sm" className="text-xs">
            View Board →
          </Button>
        </Link>
      </div>
    </div>
  );
};

const ProjectRow = ({ project, index, onEdit }: { project: Project; index: number; onEdit: (project: Project) => void }) => {
  const { updateProject, deleteProject } = useAppStore();

  const handleArchiveProject = (projectId: string) => {
    updateProject(projectId, { status: 'archived' });
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
  };

  return (
    <div
      className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer animate-slide-up group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg text-lg shrink-0"
        style={{ backgroundColor: `${project.color}20` }}
      >
        {project.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {project.name}
          </h3>
          <Badge
            variant="secondary"
            className={cn(
              'text-[10px]',
              project.status === 'active' && 'bg-success/10 text-success',
              project.status === 'completed' && 'bg-primary/10 text-primary',
              project.status === 'archived' && 'bg-muted text-muted-foreground'
            )}
          >
            {project.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">{project.description}</p>
      </div>

      <div className="hidden md:flex items-center gap-6 shrink-0">
        <div className="w-32">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-1.5" />
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground w-20">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span>{project.completedTasks}/{project.tasksCount}</span>
        </div>

        <div className="flex -space-x-2 w-24">
          {project.members.slice(0, 3).map((member) => (
            <Avatar key={member.id} className="h-6 w-6 border-2 border-card">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback className="text-[10px]">{getInitials(member.name)}</AvatarFallback>
            </Avatar>
          ))}
          {project.members.length > 3 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[9px] font-medium">
              +{project.members.length - 3}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground w-24">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{formatDate(project.dueDate)}</span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(project)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}><Archive className="h-4 w-4 mr-2" /> Archive</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Projects;
