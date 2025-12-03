import React, { useRef, useState } from 'react';
import { Category } from '../types';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieRowProps {
  category: Category;
}

const MovieRow: React.FC<MovieRowProps> = ({ category }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === 'left' ? -window.innerWidth / 1.5 : window.innerWidth / 1.5;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      if(direction === 'right') setIsMoved(true);
      if(direction === 'left' && current.scrollLeft <= 0) setIsMoved(false);
    }
  };

  return (
    <div className="py-2 pl-4 md:pl-12 relative group">
      <h3 className="text-lg md:text-xl font-bold text-white mb-3 hover:text-red-500 cursor-pointer transition-colors inline-flex items-center gap-2 group/title">
        {category.title}
        <div className="opacity-0 group-hover/title:opacity-100 transition-all transform -translate-x-2 group-hover/title:translate-x-0 text-xs text-red-500 font-semibold uppercase tracking-wider">Explore All</div>
      </h3>
      
      <div className="relative">
          {/* 
            Container with padding to allow hover cards to expand without clip.
            Removed negative margins to prevent overlap issues with other rows.
          */}
          <div 
            ref={rowRef}
            className="flex gap-4 overflow-x-auto no-scrollbar py-8 -my-8 pl-2 scroll-smooth items-center"
          >
            {category.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
             {/* Padding Card at the end */}
             <div className="w-12 md:w-20 flex-none" />
          </div>

          {/* Navigation Buttons (Visible on Hover/Desktop) */}
          {isMoved && (
            <button 
                onClick={() => scroll('left')}
                className="hidden md:flex absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-20 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                <ChevronLeft className="text-white hover:scale-125 transition-transform drop-shadow-lg" size={40} />
            </button>
          )}
          
          <button 
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-20 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
             <ChevronRight className="text-white hover:scale-125 transition-transform drop-shadow-lg" size={40} />
          </button>
      </div>
    </div>
  );
};

export default MovieRow;