import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getCurrentUser, getWorkouts, createWorkout } from '@/lib/storage';
import { Workout, Exercise } from '@/lib/types';
import { Plus, ChevronRight, Trash2 } from 'lucide-react';

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [newWorkout, setNewWorkout] = useState<Omit<Workout, 'id' | 'userId'>>({
    name: '',
    exercises: [],
    date: new Date().toISOString().split('T')[0],
  });
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      setWorkouts(getWorkouts(user.id));
    }
  }, []);

  const handleCreateWorkout = () => {
    if (!user || !newWorkout.name.trim()) return;

    const workout = createWorkout(user.id, newWorkout);
    setWorkouts([...workouts, workout]);
    setNewWorkout({
      name: '',
      exercises: [],
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddExercise = () => {
    setNewWorkout({
      ...newWorkout,
      exercises: [
        ...newWorkout.exercises,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: '',
          sets: 3,
          reps: 10,
          weight: 0,
        },
      ],
    });
  };

  const handleRemoveExercise = (index: number) => {
    const exercises = [...newWorkout.exercises];
    exercises.splice(index, 1);
    setNewWorkout({
      ...newWorkout,
      exercises,
    });
  };

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const exercises = [...newWorkout.exercises];
    exercises[index] = {
      ...exercises[index],
      [field]: field === 'name' ? value : Number(value),
    };
    setNewWorkout({
      ...newWorkout,
      exercises,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Workouts</h2>
        <p className="text-muted-foreground">Track your workouts and exercises</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Workouts</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Workout</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Workout name"
                      value={newWorkout.name}
                      onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    />
                    <Input
                      type="date"
                      value={newWorkout.date}
                      onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    {newWorkout.exercises.map((exercise, index) => (
                      <div key={exercise.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center">
                        <Input
                          placeholder="Exercise name"
                          value={exercise.name}
                          onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Sets"
                          className="w-20"
                          value={exercise.sets}
                          onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Reps"
                          className="w-20"
                          value={exercise.reps}
                          onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Weight"
                          className="w-24"
                          value={exercise.weight}
                          onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveExercise(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={handleAddExercise}>
                      Add Exercise
                    </Button>
                  </div>
                  <Button onClick={handleCreateWorkout}>Save Workout</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-2">
                {workouts.map((workout) => (
                  <Button
                    key={workout.id}
                    variant="ghost"
                    className={cn(
                      'w-full justify-between',
                      selectedWorkout?.id === workout.id && 'bg-accent'
                    )}
                    onClick={() => setSelectedWorkout(workout)}
                  >
                    <div className="flex flex-col items-start">
                      <span>{workout.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="h-[calc(100vh-12rem)]">
          <CardContent className="p-6">
            {selectedWorkout ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">{selectedWorkout.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedWorkout.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-4">
                  {selectedWorkout.exercises.map((exercise) => (
                    <div key={exercise.id} className="border-b pb-4">
                      <h4 className="font-semibold">{exercise.name}</h4>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>{exercise.sets} sets</span>
                        <span>{exercise.reps} reps</span>
                        <span>{exercise.weight} lbs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a workout to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}