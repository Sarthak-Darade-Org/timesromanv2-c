
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';

interface FeaturedArticleProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  id,
  title,
  excerpt,
  category,
  date,
  imageUrl,
}) => {
  // Map category to color class
  const getCategoryClass = () => {
    switch (category.toLowerCase()) {
      case 'technology': return 'bg-blue-600 dark:bg-blue-500';
      case 'business': return 'bg-emerald-600 dark:bg-emerald-500';
      case 'health': return 'bg-red-600 dark:bg-red-500';
      case 'entertainment': return 'bg-purple-600 dark:bg-purple-500';
      case 'sports': return 'bg-amber-600 dark:bg-amber-500';
      case 'politics': return 'bg-orange-600 dark:bg-orange-500';
      case 'science': return 'bg-cyan-600 dark:bg-cyan-500';
      default: return 'bg-blue-600 dark:bg-blue-500';
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
      <Link to={`/article/${id}`} className="block">
        {/* Image with gradient overlay */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>
        
        {/* Content positioned over the image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform transition-transform duration-300 group-hover:translate-y-[-5px]">
          <span className={`inline-block rounded-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white ${getCategoryClass()}`}>
            {category}
          </span>
          <h2 className="mt-2 font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-white group-hover:text-blue-200 transition-colors duration-300">
            {title}
          </h2>
          <p className="mt-2 hidden md:block text-sm text-gray-200 group-hover:text-white transition-colors duration-300">{excerpt}</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center text-gray-300 text-xs">
              <Clock className="mr-1 h-3 w-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-gray-300 text-xs">
              <BookOpen className="mr-1 h-3 w-3" />
              <span>4 min read</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedArticle;
