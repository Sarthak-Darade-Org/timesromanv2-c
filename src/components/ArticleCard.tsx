
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Eye } from 'lucide-react';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  date: string;
  imageUrl: string;
  readTime?: string;
  views?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt = '',
  category,
  date,
  imageUrl,
  readTime = '3 min',
  views,
  className = '',
  style,
}) => {
  // Map category to color class
  const getCategoryClass = () => {
    switch (category.toLowerCase()) {
      case 'technology': return 'category-tech';
      case 'business': return 'category-business';
      case 'health': return 'category-health';
      case 'entertainment': return 'category-entertainment';
      case 'sports': return 'category-sports';
      case 'politics': return 'bg-red-600';
      case 'science': return 'bg-cyan-600';
      default: return 'bg-blue-600';
    }
  };

  // Generate a tiny placeholder for progressive loading
  const createPlaceholder = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzIDIiPjwvc3ZnPg==';
  };

  // Random view count for display if not provided
  const displayViews = views !== undefined ? views : Math.floor(Math.random() * 500) + 100;

  return (
    <div 
      className={`group overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 article-card-animate h-full flex flex-col ${className}`} 
      style={style}
    >
      <Link to={`/article/${id}`} className="block h-full flex flex-col">
        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80';
            }}
            // Removed the placeholder attribute as it's not valid on HTML img elements
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-2 flex items-center justify-between flex-wrap gap-2">
            <span className={`inline-block text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full text-white ${getCategoryClass()}`}>
              {category}
            </span>
            <div className="flex items-center text-gray-500 text-xs">
              <Clock className="mr-1 h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>
          <h3 className="mb-2 font-serif text-lg font-semibold leading-snug tracking-tight text-gray-900 group-hover:text-blue-600 text-animate">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-600 flex-grow">{excerpt}</p>
          
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <BookOpen className="mr-1 h-3 w-3" />
              <span>{readTime} read</span>
            </div>
            <div className="flex items-center">
              <Eye className="mr-1 h-3 w-3" />
              <span>{displayViews} views</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
