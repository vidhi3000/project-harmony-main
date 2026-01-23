import { AppLayout } from '@/components/layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TasksChart, TaskStatusChart, TeamPerformanceChart } from '@/components/dashboard/Charts';
import { ProjectsOverview } from '@/components/dashboard/ProjectsOverview';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/hooks/useTheme';
import { CheckCircle2, Clock, FolderKanban, Users, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { projects, tasks, currentUser } = useAppStore();
  useTheme(); // Initialize theme

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length;

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      change: { value: 12, isPositive: true },
      icon: <FolderKanban className="h-6 w-6 text-primary" />,
      variant: 'default' as const,
    },
    {
      title: 'Tasks Completed',
      value: completedTasks,
      change: { value: 24, isPositive: true },
      icon: <CheckCircle2 className="h-6 w-6 text-primary-foreground" />,
      variant: 'primary' as const,
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      change: { value: 8, isPositive: true },
      icon: <Clock className="h-6 w-6 text-warning-foreground" />,
      variant: 'warning' as const,
    },
    {
      title: 'Urgent Tasks',
      value: urgentTasks,
      change: { value: -15, isPositive: false },
      icon: <AlertCircle className="h-6 w-6 text-primary-foreground" />,
      variant: 'info' as const,
    },
  ];

  return (
    <AppLayout
      title={`Welcome back, ${currentUser?.name?.split(' ')[0] || 'User'}`}
      subtitle="Here's what's happening with your projects today."
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={stat.title} style={{ animationDelay: `${index * 100}ms` }}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TasksChart />
        <TaskStatusChart />
      </div>

      {/* Bottom Row */}
      <ProjectsOverview />
    </AppLayout>
  );
};

export default Dashboard;
