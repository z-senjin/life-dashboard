import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createUser, getUserByEmail, setCurrentUser } from '@/lib/storage';

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = getUserByEmail(email);
      if (user && user.password === password) {
        setCurrentUser(user);
        onSuccess();
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!email || !password || !name) {
        setError('All fields are required');
        return;
      }
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        setError('Email already exists');
        return;
      }
      const user = createUser(email, password, name);
      setCurrentUser(user);
      onSuccess();
    }
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{isLogin ? 'Login' : 'Register'}</CardTitle>
        <CardDescription>
          {isLogin
            ? 'Enter your credentials to access your account'
            : 'Create a new account to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            {isLogin ? 'Login' : 'Register'}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}