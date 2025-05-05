
import React, { useEffect, useState } from 'react';

const ReadingProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / totalHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" 
        style={{ width: `${scrollProgress}%`, transition: 'width 0.2s ease-out' }}
      />
    </div>
  );
};

export default ReadingProgressBar;
