import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSliderProps {
  movies: Movie[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(() => setScrollY(window.scrollY));
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 12000); 
    return () => clearInterval(interval);
  }, [movies.length]);

  const handleNext = () => {
      setAnimating(true);
      setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % movies.length);
          setAnimating(false);
      }, 800);
  };

  const movie = movies[currentIndex];

  if (!movie) return <div className="w-full h-[65vh] bg-[#0f1014] skeleton-shimmer"></div>;

  return (
    <div className="relative w-full h-[85vh] md:h-[95vh] overflow-hidden group bg-black z-0">
      
      {/* Background Image Parallax */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }} // Reduced parallax speed to prevent bottom gap
      >
          <div 
            key={movie.id}
            className={`w-full h-[120%] bg-cover bg-center transition-all duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1) ${animating ? 'opacity-0 scale-110 grayscale' : 'opacity-100 scale-100 grayscale-0'}`}
            style={{ backgroundImage: `url(${movie.coverUrl})` }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
      </div>

      {/* Political Gradient Overlays */}
      {/* 1. Base Darkening from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent pointer-events-none z-10"></div>
      
      {/* 2. Side Darkening for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent w-full md:w-3/4 pointer-events-none z-10"></div>

      {/* 3. Subtle Animated Tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-red-900/20 mix-blend-overlay pointer-events-none z-10 animate-political-gradient opacity-60"></div>

      {/* Content */}
      <div className={`absolute inset-0 flex flex-col justify-end md:justify-center px-6 md:px-16 pb-40 md:pb-20 z-20 max-w-6xl transition-all duration-1000 ease-out ${animating ? 'opacity-0 translate-y-8 blur-sm' : 'opacity-100 translate-y-0 blur-0'}`}>
        <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
                 {movie.type === 'live' && (
                     <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded animate-pulse shadow-lg shadow-red-600/40">🔴 LIVE NOW</span>
                 )}
                 <span className="text-blue-400 font-bold tracking-widest uppercase text-xs flex items-center gap-2 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 backdrop-blur-md">
                     <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                     {movie.channelName || 'Yutify Exclusive'}
                 </span>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white leading-[0.95] tracking-tighter shadow-black drop-shadow-2xl">
                {movie.title}
            </h2>
            
            <div className="flex items-center gap-4 text-sm md:text-base text-gray-300 mb-8 font-medium">
                <span className="text-white font-bold">{movie.year}</span>
                <span className="text-gray-500">•</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs border border-white/10">{movie.rating}</span>
                <span className="text-gray-500">•</span>
                <span className="text-red-400 font-semibold border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded">{movie.genre.slice(0,2).join(' | ')}</span>
                <span className="text-gray-500">•</span>
                <span>{movie.duration}</span>
            </div>

            <p className="text-gray-200 text-sm md:text-lg mb-10 line-clamp-3 max-w-2xl drop-shadow-md leading-relaxed border-l-4 border-red-600 pl-6 bg-black/30 backdrop-blur-sm py-4 rounded-r-xl">
                {movie.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
                <Link 
                    to={`/watch/${movie.id}`}
                    className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 hover:bg-gray-100 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                    <Play size={22} fill="currentColor" />
                    <span className="text-base tracking-wide uppercase">Watch Now</span>
                </Link>
                
                <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold transition-all border border-white/10 hover:border-white/30">
                    <Info size={22} />
                    <span className="text-base tracking-wide uppercase">Details</span>
                </button>
            </div>
        </div>
      </div>
      
      {/* Slider Indicators */}
      <div className="absolute right-8 bottom-40 md:right-12 md:bottom-24 flex flex-col gap-4 z-30">
          {movies.map((m, idx) => (
              <div 
                key={m.id} 
                className={`transition-all duration-500 cursor-pointer rounded-full relative ${idx === currentIndex ? 'h-8 w-1.5 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]' : 'h-1.5 w-1.5 bg-gray-600 hover:bg-white'}`}
                onClick={() => setCurrentIndex(idx)}
              />
          ))}
      </div>
    </div>
  );
};

export default HeroSlider;