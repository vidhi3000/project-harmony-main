import { create } from 'zustand';

export type UserRole = 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  timezone?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  status: 'active' | 'completed' | 'archived';
  progress: number;
  tasksCount: number;
  completedTasks: number;
  members: User[];
  createdAt: string;
  dueDate: string;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assignee?: User;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'comment' | 'mention' | 'deadline' | 'project_update';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// Dummy Data
export const dummyUsers: User[] = [
  { id: '1', name: 'Vidhi', email: 'Vidhi@flowboard.io', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vidhi', role: 'admin', timezone: 'utc-8' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@flowboard.io', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'member', timezone: 'utc-5' },
  { id: '3', name: 'Khushi', email: 'Khushi@flowboard.io', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khushi', role: 'member', timezone: 'utc+5.5' },
  { id: '4', name: 'Emily Davis', email: 'emily@flowboard.io', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', role: 'viewer', timezone: 'utc+1' },
  { id: '5', name: 'James Wilson', email: 'james@flowboard.io', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', role: 'member', timezone: 'utc+0' },
];

export const dummyProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with new branding',
    color: '#6366f1',
    icon: '🎨',
    status: 'active',
    progress: 68,
    tasksCount: 24,
    completedTasks: 16,
    members: [dummyUsers[0], dummyUsers[1], dummyUsers[2]],
    createdAt: '2025-01-15',
    dueDate: '2025-03-01',
  },
  {
    id: 'p2',
    name: 'Mobile App v2.0',
    description: 'New features and performance improvements for the mobile application',
    color: '#10b981',
    icon: '📱',
    status: 'active',
    progress: 42,
    tasksCount: 36,
    completedTasks: 15,
    members: [dummyUsers[1], dummyUsers[2], dummyUsers[4]],
    createdAt: '2025-01-20',
    dueDate: '2025-04-15',
  },
  {
    id: 'p3',
    name: 'API Integration',
    description: 'Third-party API integrations for payment and analytics',
    color: '#f59e0b',
    icon: '🔗',
    status: 'active',
    progress: 85,
    tasksCount: 18,
    completedTasks: 15,
    members: [dummyUsers[0], dummyUsers[4]],
    createdAt: '2025-02-01',
    dueDate: '2025-02-28',
  },
  {
    id: 'p4',
    name: 'Marketing Campaign',
    description: 'Q1 2025 marketing campaign planning and execution',
    color: '#ec4899',
    icon: '📢',
    status: 'active',
    progress: 25,
    tasksCount: 12,
    completedTasks: 3,
    members: [dummyUsers[2], dummyUsers[3]],
    createdAt: '2025-02-10',
    dueDate: '2025-05-01',
  },
];

export const dummyTasks: Task[] = [
  { id: 't1', title: 'Design new homepage layout', description: 'Create wireframes and mockups for the new homepage', status: 'done', priority: 'high', projectId: 'p1', assignee: dummyUsers[1], dueDate: '2025-02-15', tags: ['design', 'ui'], createdAt: '2025-01-16', updatedAt: '2025-02-10' },
  { id: 't2', title: 'Implement responsive navigation', description: 'Build mobile-first responsive navigation component', status: 'in_progress', priority: 'high', projectId: 'p1', assignee: dummyUsers[2], dueDate: '2025-02-20', tags: ['frontend', 'mobile'], createdAt: '2025-01-18', updatedAt: '2025-02-12' },
  { id: 't3', title: 'Setup CI/CD pipeline', description: 'Configure automated testing and deployment', status: 'review', priority: 'medium', projectId: 'p1', assignee: dummyUsers[0], dueDate: '2025-02-18', tags: ['devops'], createdAt: '2025-01-20', updatedAt: '2025-02-14' },
  { id: 't4', title: 'User authentication flow', description: 'Implement login, signup, and password reset', status: 'todo', priority: 'urgent', projectId: 'p2', assignee: dummyUsers[4], dueDate: '2025-02-25', tags: ['backend', 'security'], createdAt: '2025-01-22', updatedAt: '2025-02-01' },
  { id: 't5', title: 'Push notifications', description: 'Integrate Firebase for push notifications', status: 'backlog', priority: 'medium', projectId: 'p2', tags: ['mobile', 'backend'], createdAt: '2025-01-25', updatedAt: '2025-01-25' },
  { id: 't6', title: 'Payment gateway integration', description: 'Integrate Stripe for payment processing', status: 'in_progress', priority: 'urgent', projectId: 'p3', assignee: dummyUsers[0], dueDate: '2025-02-22', tags: ['backend', 'payments'], createdAt: '2025-02-02', updatedAt: '2025-02-15' },
  { id: 't7', title: 'Analytics dashboard', description: 'Build analytics overview with charts', status: 'todo', priority: 'high', projectId: 'p3', assignee: dummyUsers[4], dueDate: '2025-02-26', tags: ['frontend', 'data'], createdAt: '2025-02-05', updatedAt: '2025-02-10' },
  { id: 't8', title: 'Create social media assets', description: 'Design graphics for social media campaigns', status: 'in_progress', priority: 'medium', projectId: 'p4', assignee: dummyUsers[2], dueDate: '2025-02-28', tags: ['design', 'marketing'], createdAt: '2025-02-11', updatedAt: '2025-02-16' },
  { id: 't9', title: 'Write blog content', description: 'Create 5 blog posts for the campaign', status: 'backlog', priority: 'low', projectId: 'p4', tags: ['content', 'marketing'], createdAt: '2025-02-12', updatedAt: '2025-02-12' },
  { id: 't10', title: 'Performance optimization', description: 'Optimize bundle size and loading speed', status: 'review', priority: 'high', projectId: 'p1', assignee: dummyUsers[2], dueDate: '2025-02-19', tags: ['frontend', 'performance'], createdAt: '2025-01-28', updatedAt: '2025-02-16' },
];

export const dummyNotifications: Notification[] = [
  { id: 'n1', type: 'task_assigned', title: 'New task assigned', message: 'You have been assigned to "Payment gateway integration"', read: false, createdAt: '2025-02-16T10:30:00', link: '/board' },
  { id: 'n2', type: 'comment', title: 'New comment', message: 'Sarah commented on "Design new homepage layout"', read: false, createdAt: '2025-02-16T09:15:00', link: '/board' },
  { id: 'n3', type: 'deadline', title: 'Deadline approaching', message: '"Implement responsive navigation" is due in 2 days', read: true, createdAt: '2025-02-15T14:00:00', link: '/board' },
  { id: 'n4', type: 'project_update', title: 'Project updated', message: 'Website Redesign progress updated to 68%', read: true, createdAt: '2025-02-15T11:00:00', link: '/projects' },
  { id: 'n5', type: 'mention', title: 'You were mentioned', message: 'Marcus mentioned you in a comment', read: true, createdAt: '2025-02-14T16:30:00', link: '/board' },
];

// Zustand Store
interface AppState {
  currentUser: User;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  projects: Project[];
  tasks: Task[];
  notifications: Notification[];

  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteTask: (taskId: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: dummyUsers[0],
  theme: 'dark',
  sidebarOpen: true,
  projects: dummyProjects,
  tasks: dummyTasks,
  notifications: dummyNotifications,
  
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
    ),
  })),
  
  moveTask: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } : task
    ),
  })),
  
  markNotificationRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    ),
  })),
  
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
  })),

  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }],
  })),

  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== taskId),
  })),

  addProject: (project) => set((state) => ({
    projects: [...state.projects, {
      ...project,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
    }],
  })),

  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map((project) =>
      project.id === projectId ? { ...project, ...updates } : project
    ),
  })),

  deleteProject: (projectId) => set((state) => ({
    projects: state.projects.filter((project) => project.id !== projectId),
  })),

  updateCurrentUser: (updates) => set((state) => ({
    currentUser: { ...state.currentUser, ...updates },
  })),
}));
