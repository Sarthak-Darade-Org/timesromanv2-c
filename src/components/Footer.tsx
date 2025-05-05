
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold text-white">Times Roman</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              Next-generation AI-powered news platform delivering fresh, unbiased perspectives.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/politics" className="text-gray-400 hover:text-white">Politics</Link>
              </li>
              <li>
                <Link to="/category/technology" className="text-gray-400 hover:text-white">Technology</Link>
              </li>
              <li>
                <Link to="/category/business" className="text-gray-400 hover:text-white">Business</Link>
              </li>
              <li>
                <Link to="/category/science" className="text-gray-400 hover:text-white">Science</Link>
              </li>
              <li>
                <Link to="/category/health" className="text-gray-400 hover:text-white">Health</Link>
              </li>
              <li>
                <Link to="/category/entertainment" className="text-gray-400 hover:text-white">Entertainment</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Subscribe</h3>
            <p className="mb-4 text-sm text-gray-400">
              Get the latest news delivered to your inbox.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-l-md border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="rounded-r-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Times Roman. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
