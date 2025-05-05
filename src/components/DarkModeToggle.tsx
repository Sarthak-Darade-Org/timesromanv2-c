
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const DarkModeToggle = () => {
  // Check if user has a dark mode preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check user preference from localStorage
    if (typeof window !== 'undefined') {
      const storedPreference = window.localStorage.getItem('darkMode');
      if (storedPreference !== null) {
        return storedPreference === 'true';
      }
      // If no stored preference, check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="rounded-full w-9 h-9 p-0 transition-all duration-300"
        >
          {isDarkMode ? (
            <Moon className="h-5 w-5 text-yellow-300 transition-all" />
          ) : (
            <Sun className="h-5 w-5 text-amber-500 transition-all" />
          )}
          <span className="sr-only">{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span>Switch to {isDarkMode ? 'light mode' : 'dark mode'}</span>
      </TooltipContent>
    </Tooltip>
  );
};

export default DarkModeToggle;
