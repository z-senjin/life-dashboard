import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getCurrentUser, getTasks, createTask } from '@/lib/storage';
import { Plus } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      setTasks(getTasks(user.id));
    }
  }, []);

  const handleAddTask = () => {
    if (!user || !newTask.trim()) return;

    const task = createTask(user.id, {
      title: newTask,
      description: '',
      completed: false,
    });

    setTasks([...tasks, task]);
    setNewTask('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <p className="text-muted-foreground">Manage your tasks and to-dos</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button onClick={handleAddTask}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center space-x-2 border-b pb-2"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => {
                    const updatedTasks = tasks.map((t) =>
                      t.id === task.id ? { ...t, completed: !!checked } : t
                    );
                    setTasks(updatedTasks);
                    localStorage.setItem(
                      `tasks_${user?.id}`,
                      JSON.stringify(updatedTasks)
                    );
                  }}
                />
                <span
                  className={cn(
                    task.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}