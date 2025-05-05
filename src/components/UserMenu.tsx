
import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Link to="/auth">
        <Button variant="ghost" size="sm" className="gap-2">
          <UserCircle className="h-5 w-5" />
          <span className="hidden md:inline">Sign In</span>
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <UserCircle className="h-5 w-5" />
          <span className="hidden md:inline">
            {user.email?.split('@')[0] || 'Account'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium">
          <p className="truncate">Signed in as</p>
          <p className="truncate text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex w-full cursor-pointer items-center">
            <UserIcon className="mr-2 h-4 w-4" /> Your Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex w-full cursor-pointer items-center">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
