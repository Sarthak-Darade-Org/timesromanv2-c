
import React from 'react';
import UserMenu from './UserMenu';
import DarkModeToggle from './DarkModeToggle';

export const NavbarActions: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <DarkModeToggle />
      <UserMenu />
    </div>
  );
};
