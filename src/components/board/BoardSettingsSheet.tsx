import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useAppStore, TaskStatus } from '@/store/appStore';

const BoardSettingsSheet = () => {
  const { boardSettings, updateBoardSettings } = useAppStore();
  const [localVisibleColumns, setLocalVisibleColumns] = useState<TaskStatus[]>(boardSettings.visibleColumns);

  const allColumns: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done'];

  const handleColumnToggle = (column: TaskStatus, checked: boolean) => {
    if (checked) {
      setLocalVisibleColumns([...localVisibleColumns, column]);
    } else {
      setLocalVisibleColumns(localVisibleColumns.filter(c => c !== column));
    }
  };

  const handleSave = () => {
    updateBoardSettings({ visibleColumns: localVisibleColumns });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Board Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-sm font-medium">Visible Columns</Label>
            <div className="space-y-2 mt-2">
              {allColumns.map((column) => (
                <div key={column} className="flex items-center space-x-2">
                  <Checkbox
                    id={`column-${column}`}
                    checked={localVisibleColumns.includes(column)}
                    onCheckedChange={(checked) => handleColumnToggle(column, checked as boolean)}
                  />
                  <Label htmlFor={`column-${column}`} className="capitalize">
                    {column.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BoardSettingsSheet;
