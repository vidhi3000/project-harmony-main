import { create } from 'zustand';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
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
  dueDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId?: string;
  dueDate?: Date;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task_assigned' | 'comment' | 'deadline' | 'project_update' | 'mention';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface BoardSettings {
  visibleColumns: TaskStatus[];
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
  boardSettings: BoardSettings;
  setTheme: (theme: AppState['theme']) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  updateBoardSettings: (settings: Partial<BoardSettings>) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteProject: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
}

// Dummy data
export const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'member',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    role: 'member',
  },
  {
    id: '4',
    name: 'Alice Cooper',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    role: 'member',
  },
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
    createdAt: new Date('2024-01-15'),
    dueDate: '2024-03-01',
    updatedAt: new Date('2024-01-15'),
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
    members: [dummyUsers[1], dummyUsers[2], dummyUsers[3]],
    createdAt: new Date('2024-01-20'),
    dueDate: '2024-04-15',
    updatedAt: new Date('2024-01-20'),
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
    members: [dummyUsers[0], dummyUsers[3]],
    createdAt: new Date('2024-02-01'),
    dueDate: '2024-02-28',
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'p4',
    name: 'Marketing Campaign',
    description: 'Q1 2024 marketing campaign planning and execution',
    color: '#ec4899',
    icon: '📢',
    status: 'active',
    progress: 25,
    tasksCount: 12,
    completedTasks: 3,
    members: [dummyUsers[2], dummyUsers[3]],
    createdAt: new Date('2024-02-10'),
    dueDate: '2024-05-01',
    updatedAt: new Date('2024-02-10'),
  },
];

export const dummyTasks: Task[] = [
  { id: 't1', title: 'Design new homepage layout', description: 'Create wireframes and mockups for the new homepage', status: 'done', priority: 'high', projectId: 'p1', assigneeId: dummyUsers[1].id, dueDate: new Date('2024-02-15'), tags: ['design', 'ui'], createdAt: '2024-01-16', updatedAt: '2024-02-10' },
  { id: 't2', title: 'Implement responsive navigation', description: 'Build mobile-first responsive navigation component', status: 'in_progress', priority: 'high', projectId: 'p1', assigneeId: dummyUsers[2].id, dueDate: new Date('2024-02-20'), tags: ['frontend', 'mobile'], createdAt: '2024-01-18', updatedAt: '2024-02-12' },
  { id: 't3', title: 'Setup CI/CD pipeline', description: 'Configure automated testing and deployment', status: 'review', priority: 'medium', projectId: 'p1', assigneeId: dummyUsers[0].id, dueDate: new Date('2024-02-18'), tags: ['devops'], createdAt: '2024-01-20', updatedAt: '2024-02-14' },
  { id: 't4', title: 'User authentication flow', description: 'Implement login, signup, and password reset', status: 'todo', priority: 'urgent', projectId: 'p2', assigneeId: dummyUsers[3].id, dueDate: new Date('2024-02-25'), tags: ['backend', 'security'], createdAt: '2024-01-22', updatedAt: '2024-02-01' },
  { id: 't5', title: 'Push notifications', description: 'Integrate Firebase for push notifications', status: 'backlog', priority: 'medium', projectId: 'p2', tags: ['mobile', 'backend'], createdAt: '2024-01-25', updatedAt: '2024-01-25' },
  { id: 't6', title: 'Payment gateway integration', description: 'Integrate Stripe for payment processing', status: 'in_progress', priority: 'urgent', projectId: 'p3', assigneeId: dummyUsers[0].id, dueDate: new Date('2024-02-22'), tags: ['backend', 'payments'], createdAt: '2024-02-02', updatedAt: '2024-02-15' },
  { id: 't7', title: 'Analytics dashboard', description: 'Build analytics overview with charts', status: 'todo', priority: 'high', projectId: 'p3', assigneeId: dummyUsers[3].id, dueDate: new Date('2024-02-26'), tags: ['frontend', 'data'], createdAt: '2024-02-05', updatedAt: '2024-02-10' },
  { id: 't8', title: 'Create social media assets', description: 'Design graphics for social media campaigns', status: 'in_progress', priority: 'medium', projectId: 'p4', assigneeId: dummyUsers[2].id, dueDate: new Date('2024-02-28'), tags: ['design', 'marketing'], createdAt: '2024-02-11', updatedAt: '2024-02-16' },
  { id: 't9', title: 'Write blog content', description: 'Create 5 blog posts for the campaign', status: 'backlog', priority: 'low', projectId: 'p4', tags: ['content', 'marketing'], createdAt: '2024-02-12', updatedAt: '2024-02-12' },
  { id: 't10', title: 'Performance optimization', description: 'Optimize bundle size and loading speed', status: 'review', priority: 'high', projectId: 'p1', assigneeId: dummyUsers[2].id, dueDate: new Date('2024-02-19'), tags: ['frontend', 'performance'], createdAt: '2024-01-28', updatedAt: '2024-02-16' },
];

export const dummyNotifications: Notification[] = [
  { id: 'n1', type: 'task_assigned', title: 'New task assigned', message: 'You have been assigned to "Payment gateway integration"', read: false, createdAt: '2024-02-16T10:30:00', link: '/board' },
  { id: 'n2', type: 'comment', title: 'New comment', message: 'Sarah commented on "Design new homepage layout"', read: false, createdAt: '2024-02-16T09:15:00', link: '/board' },
  { id: 'n3', type: 'deadline', title: 'Deadline approaching', message: '"Implement responsive navigation" is due in 2 days', read: true, createdAt: '2024-02-15T14:00:00', link: '/board' },
  { id: 'n4', type: 'project_update', title: 'Project updated', message: 'Website Redesign progress updated to 68%', read: true, createdAt: '2024-02-15T11:00:00', link: '/projects' },
  { id: 'n5', type: 'mention', title: 'You were mentioned', message: 'Marcus mentioned you in a comment', read: true, createdAt: '2024-02-14T16:30:00', link: '/board' },
];

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  isAuthenticated: false,
  theme: 'dark',
  sidebarOpen: true,
  users: dummyUsers,
  projects: dummyProjects,
  tasks: dummyTasks,
  notifications: dummyNotifications,
  boardSettings: {
    visibleColumns: ['backlog', 'todo', 'in_progress', 'review', 'done'],
  },

  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  updateCurrentUser: (updates) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
  })),
  updateBoardSettings: (settings) => set((state) => ({
    boardSettings: { ...state.boardSettings, ...settings },
  })),
  moveTask: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
        : task
    ),
  })),
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }],
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ),
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id),
  })),
  addProject: (project) => set((state) => ({
    projects: [...state.projects, {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
  })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === id
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ),
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(project => project.id !== id),
  })),
  addUser: (user) => set((state) => ({
    users: [...state.users, {
      ...user,
      id: Date.now().toString(),
    }],
  })),
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(user =>
      user.id === id
        ? { ...user, ...updates }
        : user
    ),
  })),
  removeUser: (id) => set((state) => ({
    users: state.users.filter(user => user.id !== id),
  })),
}));
