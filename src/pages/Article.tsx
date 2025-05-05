import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ArticlePage from '../components/ArticlePage';
import ArticleCard from '../components/ArticleCard';
import ReadingProgressBar from '../components/ReadingProgressBar';
import SEOHead from '../components/SEOHead';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  category: string;
  date: string;
  author: string;
  authorImage?: string;
  authorBio?: string;
  imageUrl: string;
  readTime?: string;
  views?: number;
  likes?: number;
}

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch the article from Supabase
    const fetchArticle = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Fetch the main article
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (articleError) {
          console.error('Error fetching article:', articleError);
          setLoading(false);
          return;
        }
        
        // Format the article data
        const formattedArticle = {
          id: articleData.id,
          title: articleData.title,
          content: articleData.content || '',
          excerpt: articleData.excerpt || '',
          category: articleData.category,
          date: articleData.date,
          author: articleData.author,
          authorImage: articleData.author_image,
          authorBio: articleData.author_bio,
          imageUrl: articleData.image_url,
          readTime: articleData.read_time || '3 min',
          views: articleData.views || 0,
          likes: articleData.likes || 0,
        };
        
        setArticle(formattedArticle);
        
        // Fetch related articles in the same category
        const { data: relatedData, error: relatedError } = await supabase
          .from('articles')
          .select('*')
          .eq('category', articleData.category)
          .neq('id', id)
          .limit(3);
        
        if (!relatedError && relatedData) {
          const formattedRelated = relatedData.map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt || '',
            category: item.category,
            date: item.date,
            author: item.author,
            imageUrl: item.image_url,
            readTime: item.read_time
          }));
          
          setRelatedArticles(formattedRelated);
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    // Scroll to top when article loads
    window.scrollTo(0, 0);
    fetchArticle();
  }, [id]);

  // Update view count when the article is viewed
  useEffect(() => {
    const updateViewCount = async () => {
      if (!article || !id) return;
      
      // Check if this article has been viewed in this session
      const viewedArticles = JSON.parse(localStorage.getItem('viewedArticles') || '{}');
      
      if (!viewedArticles[id]) {
        // Mark as viewed
        viewedArticles[id] = true;
        localStorage.setItem('viewedArticles', JSON.stringify(viewedArticles));
        
        // Update view count in Supabase
        const newViewCount = article.views ? article.views + 1 : 1;
        
        try {
          await supabase
            .from('articles')
            .update({ views: newViewCount })
            .eq('id', id);
            
          // Update local state
          setArticle(prev => prev ? {...prev, views: newViewCount} : null);
        } catch (error) {
          console.error('Error updating view count:', error);
        }
      }
    };
    
    updateViewCount();
  }, [article, id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SEOHead title="Loading Article | Times Roman" />
        <Navbar />
        <main className="container mx-auto flex-1 px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <SEOHead title="Article Not Found | Times Roman" description="The article you're looking for doesn't exist or has been removed." />
        <Navbar />
        <main className="container mx-auto flex-1 px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold">Article not found</h1>
            <p className="mt-2 text-gray-600">The article you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Back to Homepage
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Standardize article format to ensure all required fields exist
  const standardizedArticle = {
    id: article.id,
    title: article.title,
    content: article.content || '',
    excerpt: article.excerpt || '',
    category: article.category,
    date: article.date,
    author: article.author,
    authorImage: article.authorImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
    authorBio: article.authorBio || 'Times Roman Editorial Team',
    imageUrl: article.imageUrl,
    readTime: article.readTime || '3 min',
    views: article.views || 0,
    likes: article.likes || 0,
  };

  // Create ISO date format for SEO
  const publishDate = new Date(article.date);
  const isoDate = !isNaN(publishDate.getTime()) ? 
    publishDate.toISOString() : 
    new Date().toISOString();

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead 
        title={`${article.title} | Times Roman`}
        description={article.excerpt || `Read about ${article.title} in our ${article.category} section.`}
        ogImage={article.imageUrl}
        ogType="article"
        articleMeta={{
          publishedTime: isoDate,
          author: article.author,
          category: article.category
        }}
      />
      <ReadingProgressBar />
      <Navbar />
      
      <main className="flex-1">
        <ArticlePage {...standardizedArticle} />
        
        {/* Ad slot between article and related content */}
        <div className="bg-gray-100 py-6 text-center">
          <div className="container mx-auto px-4">
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 shadow-sm">
              <p className="text-gray-400">Advertisement</p>
              <div className="mx-auto h-[250px] max-w-[300px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Ad Slot - 300x250</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Articles Section */}
        <section className="bg-gray-50 py-12 animate-[fadeIn_1s_ease-in-out]">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 font-serif text-2xl font-bold">Related Articles</h2>
            {relatedArticles.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedArticles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    {...article} 
                    className="transform transition-all hover:translate-y-[-8px]" 
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No related articles found.</p>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;
