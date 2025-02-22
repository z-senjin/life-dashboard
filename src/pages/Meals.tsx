import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getCurrentUser, getMeals, createMeal } from '@/lib/storage';
import { Meal } from '@/lib/types';
import { Plus, ChevronRight } from 'lucide-react';

export default function Meals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [newMeal, setNewMeal] = useState({
    name: '',
    instructions: '',
    ingredients: [''],
    prepTime: 0,
    cookTime: 0,
    servings: 1,
  });
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      setMeals(getMeals(user.id));
    }
  }, []);

  const handleCreateMeal = () => {
    if (!user || !newMeal.name.trim()) return;

    const meal = createMeal(user.id, {
      ...newMeal,
      ingredients: newMeal.ingredients.filter(Boolean),
    });

    setMeals([...meals, meal]);
    setNewMeal({
      name: '',
      instructions: '',
      ingredients: [''],
      prepTime: 0,
      cookTime: 0,
      servings: 1,
    });
  };

  const handleAddIngredient = () => {
    setNewMeal({
      ...newMeal,
      ingredients: [...newMeal.ingredients, ''],
    });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const ingredients = [...newMeal.ingredients];
    ingredients[index] = value;
    setNewMeal({
      ...newMeal,
      ingredients,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meals</h2>
        <p className="text-muted-foreground">Store and manage your favorite recipes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recipes</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Recipe</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Recipe name"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Ingredients</h4>
                    {newMeal.ingredients.map((ingredient, index) => (
                      <Input
                        key={index}
                        placeholder="Add ingredient"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                      />
                    ))}
                    <Button variant="outline" onClick={handleAddIngredient}>
                      Add Ingredient
                    </Button>
                  </div>
                  <div>
                    <Textarea
                      placeholder="Cooking instructions"
                      value={newMeal.instructions}
                      onChange={(e) => setNewMeal({ ...newMeal, instructions: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Input
                        type="number"
                        placeholder="Prep time (mins)"
                        value={newMeal.prepTime}
                        onChange={(e) => setNewMeal({ ...newMeal, prepTime: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Cook time (mins)"
                        value={newMeal.cookTime}
                        onChange={(e) => setNewMeal({ ...newMeal, cookTime: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Servings"
                        value={newMeal.servings}
                        onChange={(e) => setNewMeal({ ...newMeal, servings: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateMeal}>Save Recipe</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-2">
                {meals.map((meal) => (
                  <Button
                    key={meal.id}
                    variant="ghost"
                    className={cn(
                      'w-full justify-between',
                      selectedMeal?.id === meal.id && 'bg-accent'
                    )}
                    onClick={() => setSelectedMeal(meal)}
                  >
                    {meal.name}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="h-[calc(100vh-12rem)]">
          <CardContent className="p-6">
            {selectedMeal ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">{selectedMeal.name}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                    <span>Prep: {selectedMeal.prepTime}m</span>
                    <span>Cook: {selectedMeal.cookTime}m</span>
                    <span>Servings: {selectedMeal.servings}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Ingredients</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedMeal.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Instructions</h4>
                  <p className="whitespace-pre-wrap">{selectedMeal.instructions}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a recipe to view details
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}