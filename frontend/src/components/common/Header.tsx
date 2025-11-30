import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/db/supabase';
import { profileApi } from '@/db/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ClipboardList, LogOut, Menu, User, Users, FileText, Calendar, Settings } from 'lucide-react';
import { toast } from 'sonner';
import type { Profile } from '@/types/types';

export default function Header() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileApi.getCurrentProfile();
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const employeeLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: ClipboardList },
    { path: '/attendance', label: 'Mark Attendance', icon: Calendar },
    { path: '/history', label: 'My History', icon: FileText },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const managerLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: ClipboardList },
    { path: '/team-attendance', label: 'Team Attendance', icon: Users },
    { path: '/reports', label: 'Reports', icon: FileText },
    { path: '/admin', label: 'Admin Panel', icon: Settings },
  ];

  const links = profile?.role === 'manager' ? managerLinks : employeeLinks;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-primary-foreground" />
          </div>
          <Link to="/dashboard" className="text-xl font-bold text-foreground">
            Attendance System
          </Link>
        </div>

        <nav className="hidden xl:flex items-center gap-1 ml-8">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {profile && (
            <>
              <div className="hidden xl:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {profile.name}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {profile.role === 'manager' ? 'Manager' : 'Employee'}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile.name}</p>
                      <p className="text-xs text-muted-foreground">{profile.employee_id}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="xl:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col gap-4 mt-8">
                    <div className="flex flex-col gap-2 pb-4 border-b">
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-sm text-muted-foreground">{profile.employee_id}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary w-fit">
                        {profile.role === 'manager' ? 'Manager' : 'Employee'}
                      </span>
                    </div>
                    <nav className="flex flex-col gap-2">
                      {links.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              isActive(link.path)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {link.label}
                          </Link>
                        );
                      })}
                    </nav>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
