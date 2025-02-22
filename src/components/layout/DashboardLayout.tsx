import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  Utensils,
  Dumbbell,
  LogOut,
  Menu,
} from 'lucide-react';
import { logout } from '@/lib/storage';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: '/',
  },
  {
    title: 'Tasks',
    icon: <CheckSquare className="h-4 w-4" />,
    href: '/tasks',
  },
  {
    title: 'Notes',
    icon: <StickyNote className="h-4 w-4" />,
    href: '/notes',
  },
  {
    title: 'Meals',
    icon: <Utensils className="h-4 w-4" />,
    href: '/meals',
  },
  {
    title: 'Workouts',
    icon: <Dumbbell className="h-4 w-4" />,
    href: '/workouts',
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const Sidebar = () => (
    <ScrollArea className="flex h-full w-full flex-col gap-4 py-6">
      <div className="flex flex-col gap-4 px-2">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              'flex w-full items-center justify-start gap-2',
              window.location.pathname === item.href && 'bg-accent'
            )}
            onClick={() => {
              navigate(item.href);
              setIsOpen(false);
            }}
          >
            {item.icon}
            {item.title}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex w-screen min-h-screen">
      {/* Sidebar for desktop */}
      <aside className="hidden w-64 border-r bg-card lg:block">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-semibold">Life Dashboard</h2>
        </div>
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-16 items-center border-b px-6">
            <h2 className="text-lg font-semibold">Life Dashboard</h2>
          </div>
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div className="lg:hidden" />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}