
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Article from "./pages/Article";
import Category from "./pages/Category";
import Search from "./pages/Search";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Auth callback component to handle OAuth redirects
const AuthCallback = () => {
  React.useEffect(() => {
    // The session is automatically handled by Supabase
    window.location.href = '/';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Completing authentication, please wait...</p>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <div className="app-container">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/search" element={<Search />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
