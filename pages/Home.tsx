import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import MovieRow from '../components/MovieRow';
import ReelRow from '../components/ReelRow';
import Footer from '../components/Footer';
import { MOCK_POLITICAL_CONTENT, MOCK_CATEGORIES } from '../constants';
import { Category, Movie } from '../types';

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setCategories(MOCK_CATEGORIES);
    setFeaturedMovies(MOCK_POLITICAL_CONTENT.slice(0, 5));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 overflow-x-hidden font-sans">
      <Navbar />
      <HeroSlider movies={featuredMovies} />
      
      {/* Content Layer - Pulled up over Hero */}
      <div className="relative z-10 -mt-32 space-y-4 md:space-y-8 pb-10">
        
        {/* Subtle gradient spacer to blend hero into rows */}
        <div className="h-32 bg-gradient-to-b from-transparent to-[#0a0a0a] absolute top-[-8rem] left-0 right-0 pointer-events-none"></div>

        {categories.map((category, index) => {
            if (category.type === 'reel') {
                return <ReelRow key={category.id} category={category} />;
            }
            // Add extra z-index to earlier rows so their popups go over later rows
            const zIndexClass = `relative z-[${50 - index}]`; 
            return (
                <div key={category.id} className={zIndexClass} style={{ zIndex: 50 - index }}>
                    <MovieRow category={category} />
                </div>
            );
        })}
      </div>
      
      {/* Premium CTA */}
      <div className="mt-12 px-4 md:px-12 mb-20 relative z-10">
        <div className="bg-gradient-to-r from-[#111] to-red-950/40 rounded-3xl p-12 flex flex-col items-center justify-center gap-6 border border-white/10 text-center relative overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            
            <h3 className="text-3xl md:text-5xl font-black text-white relative z-10 tracking-tight">Join the Conversation</h3>
            <p className="text-gray-300 max-w-xl relative z-10 text-lg">Access exclusive interviews, ad-free podcasts, and live town hall events. Influence the narrative today.</p>
            <button className="bg-white text-black font-bold py-4 px-12 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(220,38,38,0.4)] relative z-10 transform hover:scale-105">
                Start Free Trial
            </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;