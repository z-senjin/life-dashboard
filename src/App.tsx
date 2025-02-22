import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthForm } from './components/auth/AuthForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { getCurrentUser } from './lib/storage';
import { Toaster } from '@/components/ui/toaster';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Tasks = React.lazy(() => import('./pages/Tasks'));
const Notes = React.lazy(() => import('./pages/Notes'));
const Meals = React.lazy(() => import('./pages/Meals'));
const Workouts = React.lazy(() => import('./pages/Workouts'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setIsAuthenticated(!!user);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            <div className="flex items-center justify-center w-screen min-h-screen bg-background">
              <AuthForm onSuccess={() => window.location.href = '/'} />
            </div>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/meals" element={<Meals />} />
                    <Route path="/workouts" element={<Workouts />} />
                  </Routes>
                </React.Suspense>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;