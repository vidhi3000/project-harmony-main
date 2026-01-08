import { AppLayout } from '@/components/layout';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';

const Board = () => {
  const { projects } = useAppStore();
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ priorities: [], assigneeIds: [] });

  return (
    <AppLayout title="Kanban Board" subtitle="Drag and drop tasks to update their status">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48 bg-secondary border-0">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.icon} {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Tasks</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="space-y-2 mt-2">
                    {['low', 'medium', 'high', 'urgent'].map((priority) => (
                      <div key={priority} className="flex items-center space-x-2">
                        <Checkbox
                          id={`priority-${priority}`}
                          checked={filters.priorities.includes(priority)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters(prev => ({ ...prev, priorities: [...prev.priorities, priority] }));
                            } else {
                              setFilters(prev => ({ ...prev, priorities: prev.priorities.filter(p => p !== priority) }));
                            }
                          }}
                        />
                        <Label htmlFor={`priority-${priority}`} className="capitalize">{priority}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Assignee</Label>
                  <Select
                    value={filters.assigneeIds.length === 1 ? filters.assigneeIds[0] : ''}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        setFilters(prev => ({ ...prev, assigneeIds: [] }));
                      } else {
                        setFilters(prev => ({ ...prev, assigneeIds: [value] }));
                      }
                    }}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      {projects.flatMap(project => project.members).filter((member, index, self) => self.findIndex(m => m.id === member.id) === index).map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>


        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
       searchQuery={searchQuery}
       selectedProject={selectedProject}
       filters={filters}  />
  
    </AppLayout>
  );
};

export default Board;
