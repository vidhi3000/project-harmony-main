import { Link } from 'react-router-dom';
import { useAppStore, Project } from '@/store/appStore';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/taskUtils';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ProjectsOverview = () => {
  const { projects } = useAppStore();

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Active Projects</h3>
        <Link to="/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {projects.slice(0, 4).map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  return (
    <div
      className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer animate-slide-up group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg text-lg flex-shrink-0"
          style={{ backgroundColor: `${project.color}20` }}
        >
          {project.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {project.name}
          </h4>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{project.progress}%</span>
            </div>
            <Progress
              value={project.progress}
              className="h-1.5"
              style={{
                '--progress-color': project.color
              } as React.CSSProperties}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
