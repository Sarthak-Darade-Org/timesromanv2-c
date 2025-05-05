
import React, { useEffect, useState, lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeaturedArticle from '../components/FeaturedArticle';
import CategorySection from '../components/CategorySection';
import SEOHead from '../components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lazy loaded components
const ArticleCard = lazy(() => import('../components/ArticleCard'));

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  date: string;
  author?: string;
  imageUrl: string;
  readTime?: string;
}

const Index = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isMobile = useIsMobile();
  
  // Categories we want to display (in order)
  const desiredCategories = ['Politics', 'Technology', 'Business', 'Health', 'Entertainment'];

  useEffect(() => {
    // Add scroll event listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Set page title
    document.title = 'Times Roman | Latest News and Articles';
    
    // Fetch all articles
    const fetchArticles = async () => {
      setLoading(true);
      
      try {
        // Fetch all articles
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching articles:', error);
          return;
        }
        
        // Format articles
        const articles = data.map(article => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt || article.content?.substring(0, 120) || '',
          content: article.content,
          category: article.category,
          date: article.date,
          author: article.author,
          imageUrl: article.image_url,
          readTime: article.read_time
        }));
        
        // Set featured article (first one for now)
        setFeaturedArticle(articles[0] || null);
        
        // Set latest articles (excluding featured)
        const latest = articles.slice(1, 5);
        setLatestArticles(latest);
        
        // Group articles by category
        const groupedByCategory: Record<string, Article[]> = {};
        const availableCategories: string[] = [];
        
        articles.forEach(article => {
          const category = article.category;
          
          if (!groupedByCategory[category]) {
            groupedByCategory[category] = [];
            availableCategories.push(category);
          }
          
          if (groupedByCategory[category].length < 3) {
            groupedByCategory[category].push(article);
          }
        });
        
        // Sort categories according to desired order
        const sortedCategories = desiredCategories.filter(
          cat => availableCategories.includes(cat)
        );
        
        // Add any categories we didn't explicitly list
        availableCategories.forEach(cat => {
          if (!sortedCategories.includes(cat)) {
            sortedCategories.push(cat);
          }
        });
        
        setCategories(sortedCategories);
        setCategoryArticles(groupedByCategory);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  // Fallback featured article when loading or no data
  const fallbackFeaturedArticle = {
    id: 'featured-1',
    title: 'AI Revolution in Journalism: How Machine Learning is Reshaping News Media',
    excerpt: 'Machine learning algorithms are transforming how news is gathered, analyzed and presented to audiences worldwide.',
    category: 'Technology',
    date: 'April 14, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80',
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <SEOHead />
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section with Featured Article */}
        <section className="container mx-auto px-4 py-6 md:py-12">
          {loading ? (
            <div className="aspect-[16/9] w-full animate-pulse bg-muted rounded-lg"></div>
          ) : (
            <FeaturedArticle {...(featuredArticle || fallbackFeaturedArticle)} />
          )}
        </section>
        
        {/* Advertisement Banner */}
        <div className="bg-accent/30 py-4 text-center">
          <div className="container mx-auto px-4">
            <div className="rounded-lg border border-dashed border-border bg-card p-2 shadow-sm">
              <p className="text-sm text-muted-foreground">Advertisement</p>
              <div className="mx-auto h-[90px] w-full max-w-[728px] bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">Ad Slot - 728x90</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Latest News Section */}
        <section className="bg-accent/20 py-10 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 font-serif text-2xl md:text-3xl font-bold border-b border-border pb-2">Latest News</h2>
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[16/10] w-full bg-muted rounded-lg"></div>
                    <div className="h-4 bg-muted rounded mt-4"></div>
                    <div className="h-4 bg-muted rounded mt-2 w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<div className="animate-pulse bg-muted h-48 rounded-lg"></div>}>
                  {latestArticles.map((article) => (
                    <ArticleCard key={article.id} {...article} />
                  ))}
                </Suspense>
              </div>
            )}
          </div>
        </section>
        
        {/* Dynamic Category Sections */}
        {categories.map((category, index) => {
          const articles = categoryArticles[category] || [];
          if (articles.length === 0) return null;
          
          return (
            <div key={category} className={index % 2 === 0 ? 'bg-background' : 'bg-accent/10'}>
              <CategorySection
                title={category}
                categoryPath={`/category/${category.toLowerCase()}`}
                articles={articles}
                loading={loading}
              />
              
              {/* Ad slot after every other category */}
              {index % 2 === 1 && (
                <div className="py-6 text-center">
                  <div className="container mx-auto px-4">
                    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-2 shadow-sm">
                      <p className="text-sm text-muted-foreground">Advertisement</p>
                      <div className="mx-auto h-[250px] max-w-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">{isMobile ? 'Mobile Ad - 300x250' : 'Desktop Ad - 970x250'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          className="fixed bottom-8 right-8 h-12 w-12 rounded-full p-0 shadow-lg transition-transform hover:scale-110"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </Button>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
