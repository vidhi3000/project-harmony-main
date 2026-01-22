import React from 'react';
import { useAppStore, TaskStatus } from '@/store/appStore';
import { KanbanColumn } from './KanbanColumn';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';

interface KanbanBoardProps {
  searchQuery: string;
  selectedProject: string;
  filters: {
    priorities: string[];
    assigneeIds: string[];
  };
}

export const KanbanBoard = ({ searchQuery, selectedProject, filters }: KanbanBoardProps) => {
  const { tasks, moveTask, boardSettings } = useAppStore();
  const columns = boardSettings.visibleColumns;

  // Filter tasks based on search query, selected project, and additional filters
  const filteredTasks = tasks.filter((task) => {
    if (!task) return false;

    const matchesSearch = searchQuery === '' ||
      (task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.tags && Array.isArray(task.tags) && task.tags.some(tag => tag && typeof tag === 'string' && tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesProject = selectedProject === 'all' || task.projectId === selectedProject;

    const matchesPriority = filters.priorities.length === 0 || filters.priorities.includes(task.priority);

    const matchesAssignee = filters.assigneeIds.length === 0 || (task.assigneeId && filters.assigneeIds.includes(task.assigneeId));

    return matchesSearch && matchesProject && matchesPriority && matchesAssignee;
  });



  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move the task to the new status
    moveTask(draggableId, destination.droppableId as TaskStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 h-[calc(100vh-180px)] scroll-smooth snap-x">
        {columns.map((status) => {
          const columnTasks = filteredTasks.filter((task) => task && task.status === status);
          return (
            <KanbanColumn key={status} status={status} tasks={columnTasks} searchQuery={searchQuery} />
          );
        })}
      </div>
    </DragDropContext>
  );
};
