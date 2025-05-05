
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  category: string;
  date: string;
  imageUrl: string;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set page title
    document.title = `Search results for "${query}" | Times Roman`;

    // Search logic
    const fetchSearchResults = async () => {
      if (!query) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      
      try {
        // Search in Supabase using ilike for case-insensitive search
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
        
        if (error) {
          console.error('Error searching articles:', error);
          return;
        }
        
        // Map to our app's article format
        const articles = data.map(article => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt || article.content?.substring(0, 120) || '',
          category: article.category,
          date: article.date,
          imageUrl: article.image_url
        }));
        
        setResults(articles);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="container mx-auto flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>
        
        {loading && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}
        
        {query && !loading && results.length === 0 && (
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <p className="text-gray-600">No results found for "{query}"</p>
            <p className="mt-2 text-sm text-gray-500">Try different keywords or browse our categories</p>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <ArticleCard 
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt || ''}
                category={article.category}
                date={article.date}
                imageUrl={article.imageUrl}
              />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
