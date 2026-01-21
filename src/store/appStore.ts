import { create } from 'zustand';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  projectId: string;
  tags?: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: Date;
}

export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  users: User[];
  projects: Project[];
  tasks: Task[];
  notifications: Notification[];
  setTheme: (theme: AppState['theme']) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
}

// Dummy data
export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
];

export const dummyProjects: Project[] = [
  {
    id: '1',
    name: 'Project Harmony',
    description: 'A project management application',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'Cross-platform mobile application',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10'),
  },
];

export const dummyTasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage',
    description: 'Create wireframes and mockups for the homepage',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '1',
    projectId: '1',
    dueDate: new Date('2024-02-01'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Set up user login and registration',
    status: 'review',
    priority: 'urgent',
    assigneeId: '2',
    projectId: '1',
    dueDate: new Date('2024-01-25'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '3',
    title: 'Write documentation',
    description: 'Create user guide and API documentation',
    status: 'todo',
    priority: 'medium',
    assigneeId: '3',
    projectId: '2',
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
];

export const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'Task Updated',
    message: 'Your task "Design homepage" has been updated',
    type: 'info',
    read: false,
    createdAt: new Date('2024-01-22'),
  },
  {
    id: '2',
    title: 'Project Deadline',
    message: 'Project "Mobile App" is approaching its deadline',
    type: 'warning',
    read: true,
    createdAt: new Date('2024-01-20'),
  },
];

export const useAppStore = create<AppState>((set) => ({
  currentUser: dummyUsers[0],
  isAuthenticated: true,
  theme: 'dark',
  sidebarOpen: true,
  users: dummyUsers,
  projects: dummyProjects,
  tasks: dummyTasks,
  notifications: dummyNotifications,

  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ),
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id),
  })),
}));
