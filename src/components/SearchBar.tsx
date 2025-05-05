
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)} 
        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Search</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search articles</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                type="search"
                placeholder="Search for articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchBar;
