import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardMetrics } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getCurrentUser, getTasks, getNotes, getMeals, getWorkouts } from '@/lib/storage';
import {
  CheckSquare,
  StickyNote,
  Utensils,
  Dumbbell,
  CheckSquareIcon,
} from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalTasks: 0,
    completedTasks: 0,
    totalNotes: 0,
    totalMeals: 0,
    totalWorkouts: 0,
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const tasks = getTasks(user.id);
      const notes = getNotes(user.id);
      const meals = getMeals(user.id);
      const workouts = getWorkouts(user.id);

      setMetrics({
        totalTasks: tasks.length,
        completedTasks: tasks.filter((task) => task.completed).length,
        totalNotes: notes.length,
        totalMeals: meals.length,
        totalWorkouts: workouts.length,
      });
    }
  }, []);

  const cards = [
    {
      title: 'Total Tasks',
      value: metrics.totalTasks,
      icon: CheckSquare,
      color: 'text-blue-500',
    },
    {
      title: 'Completed Tasks',
      value: metrics.completedTasks,
      icon: CheckSquareIcon,
      color: 'text-green-500',
    },
    {
      title: 'Notes',
      value: metrics.totalNotes,
      icon: StickyNote,
      color: 'text-yellow-500',
    },
    {
      title: 'Meals',
      value: metrics.totalMeals,
      icon: Utensils,
      color: 'text-orange-500',
    },
    {
      title: 'Workouts',
      value: metrics.totalWorkouts,
      icon: Dumbbell,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your tasks, notes, meals, and workouts
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}