
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthorAvatarProps {
  author: string;
  authorImage?: string;
  date?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AuthorAvatar: React.FC<AuthorAvatarProps> = ({ 
  author, 
  authorImage, 
  date,
  size = 'md' 
}) => {
  // Get author initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Determine avatar size class
  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      default: return 'h-10 w-10';
    }
  };

  return (
    <div className="flex items-center">
      <Avatar className={getSizeClass()}>
        {authorImage && <AvatarImage src={authorImage} alt={author} />}
        <AvatarFallback>{getInitials(author)}</AvatarFallback>
      </Avatar>
      <div className="ml-2">
        <p className="text-sm font-medium">{author}</p>
        {date && <p className="text-xs text-gray-500">{date}</p>}
      </div>
    </div>
  );
};

export default AuthorAvatar;
