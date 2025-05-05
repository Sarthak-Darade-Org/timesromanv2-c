
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load ArticleCard
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
  views?: number;
}

const categoryTitles: Record<string, string> = {
  politics: "Politics",
  technology: "Technology",
  business: "Business",
  science: "Science",
  health: "Health",
  entertainment: "Entertainment",
};

const categoryDescriptions: Record<string, string> = {
  politics: "Stay informed with the latest political developments, policy changes, and governance updates from around the world.",
  technology: "Discover cutting-edge innovations, digital trends, and tech industry news that are shaping our future.",
  business: "Track market movements, corporate strategies, and economic shifts that impact the global business landscape.",
  science: "Explore the latest discoveries, research breakthroughs, and scientific advancements across various disciplines.",
  health: "Find valuable information on medical research, wellness trends, and healthcare developments for a healthier lifestyle.",
  entertainment: "Keep up with the latest in movies, music, television, celebrity news, and cultural phenomena.",
};

const Category = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const normalizedCategoryId = categoryId?.toLowerCase() || '';
  
  const categoryTitle = categoryId ? categoryTitles[normalizedCategoryId] || categoryId : '';
  const categoryDescription = categoryId ? categoryDescriptions[normalizedCategoryId] || '' : '';
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [visibleArticles, setVisibleArticles] = useState(6);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Scroll to top when category changes
    window.scrollTo(0, 0);
    
    // Reset visible articles count
    setVisibleArticles(6);
    
    // Set page title
    document.title = `${categoryTitle} | Times Roman`;

    // Fetch articles for this category
    const fetchCategoryArticles = async () => {
      setLoading(true);
      
      try {
        // Fetch articles from this category
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('category', categoryTitle)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching category articles:', error);
          setArticles([]);
          return;
        }
        
        // Format the articles
        const formattedArticles = data.map(article => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt || article.content?.substring(0, 120) || '',
          category: article.category,
          date: article.date,
          author: article.author,
          imageUrl: article.image_url,
          readTime: article.read_time,
          views: article.views
        }));
        
        setArticles(formattedArticles);
      } catch (err) {
        console.error('Error loading category articles:', err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryArticles();
    
    return () => {
      document.title = 'Times Roman'; // Reset title on unmount
    };
  }, [categoryId, categoryTitle]);
  
  const loadMore = () => {
    setVisibleArticles((prev) => prev + 3);
  };
  
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  
  const handleSortChange = (method: string) => {
    setSortBy(method);
    
    // Sort articles by the selected method
    const sortedArticles = [...articles];
    if (method === 'latest') {
      // Sort by date (newest first)
      sortedArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (method === 'popular') {
      // Sort by views (highest first)
      sortedArticles.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    setArticles(sortedArticles);
  };
  
  // Get the appropriate gradient class for the category header
  const getCategoryGradientClass = () => {
    switch (normalizedCategoryId) {
      case 'technology': return 'from-purple-600 to-indigo-600';
      case 'business': return 'from-emerald-600 to-teal-600';
      case 'politics': return 'from-indigo-600 to-blue-600';
      case 'health': return 'from-orange-600 to-amber-600';
      case 'science': return 'from-cyan-600 to-sky-600';
      case 'entertainment': return 'from-pink-600 to-rose-600';
      default: return 'from-gray-700 to-gray-900';
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead 
        title={`${categoryTitle} News | Times Roman`}
        description={categoryDescription}
        ogType="website"
      />
      <Navbar />
      
      <main className="flex-1">
        {/* Category Header with colored gradient background */}
        <div className={`bg-gradient-to-r ${getCategoryGradientClass()} text-white py-8 md:py-12 animate-[fadeIn_0.5s_ease-in-out]`}>
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-3xl font-bold md:text-5xl">{categoryTitle}</h1>
            <p className="mt-3 max-w-2xl text-base md:text-lg text-white/90">{categoryDescription}</p>
          </div>
        </div>
        
        {/* Advertisement Banner */}
        <div className="bg-white py-4 text-center border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2 shadow-sm">
              <p className="text-sm text-gray-400">Advertisement</p>
              <div className="mx-auto h-[90px] w-full max-w-[728px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Ad Slot - 728x90</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter and Sort Section */}
        <div className="bg-gray-50 py-4 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={toggleFilter}
                >
                  <Filter size={16} />
                  Filter
                </Button>
                
                {filterOpen && (
                  <div className="ml-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <div className="flex gap-2">
                      <Button 
                        variant={sortBy === 'latest' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSortChange('latest')}
                      >
                        Latest
                      </Button>
                      <Button 
                        variant={sortBy === 'popular' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => handleSortChange('popular')}
                      >
                        Popular
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {Math.min(visibleArticles, articles.length)} of {articles.length} articles
              </div>
            </div>
          </div>
        </div>
        
        {/* Articles Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 stagger-animate">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[16/10] w-full bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded mt-4"></div>
                    <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-animate">
                  <Suspense fallback={<div className="col-span-full flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>}>
                    {articles.slice(0, visibleArticles).map((article, index) => (
                      <>
                        {/* Insert ad after every 3 articles */}
                        {index > 0 && index % 3 === 0 && (
                          <div className="col-span-full my-6" key={`ad-${index}`}>
                            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2 shadow-sm">
                              <p className="text-sm text-gray-400 text-center">Advertisement</p>
                              <div className="mx-auto h-[250px] max-w-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">{isMobile ? 'Mobile Ad - 300x250' : 'In-feed Ad - 728x90'}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <ArticleCard 
                          key={article.id} 
                          {...article} 
                          className="fade-in-element" 
                          style={{animationDelay: `${index * 0.1}s`}}
                        />
                      </>
                    ))}
                  </Suspense>
                </div>
                
                {visibleArticles < articles.length && (
                  <div className="mt-8 flex justify-center">
                    <Button 
                      onClick={loadMore} 
                      className="px-8 py-2 transition-all hover:scale-105"
                    >
                      Load More Articles
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <h2 className="text-2xl font-bold">No articles found</h2>
                <p className="mt-2 text-gray-600">There are no articles in this category yet.</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Bottom Advertisement Banner */}
        <div className="bg-gray-50 py-6 text-center">
          <div className="container mx-auto px-4">
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-2 shadow-sm">
              <p className="text-sm text-gray-400">Advertisement</p>
              <div className="mx-auto h-[250px] max-w-[970px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Ad Slot - 970x250</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Category;
