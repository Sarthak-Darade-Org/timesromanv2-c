
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SearchBar from './SearchBar';
import { NavbarActions } from './NavbarActions';

const categories = [
  { name: "Politics", path: "/category/politics" },
  { name: "Technology", path: "/category/technology" },
  { name: "Business", path: "/category/business" },
  { name: "Science", path: "/category/science" },
  { name: "Health", path: "/category/health" },
  { name: "Entertainment", path: "/category/entertainment" },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-background text-foreground dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="font-serif text-2xl font-bold tracking-tight">Times Roman</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  className="text-sm font-medium text-foreground hover:text-black dark:hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu and Search */}
          <div className="flex items-center space-x-2">
            <SearchBar />
            
            {/* Dark mode toggle and User Menu */}
            <NavbarActions />
            
            {/* Mobile menu button */}
            <button
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="block px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
