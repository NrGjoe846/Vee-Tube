import React, { useRef, useState } from 'react';
import { Category } from '../types';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';

interface ReelRowProps {
  category: Category;
}

const ReelRow: React.FC<ReelRowProps> = ({ category }) => {
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
    <div className="py-8 pl-4 md:pl-8 relative group">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg">
            <Smartphone size={16} className="text-white" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white hover:text-blue-400 cursor-pointer transition-colors group/title">
            {category.title}
        </h3>
      </div>
      
      <div className="relative">
          <div 
            ref={rowRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth items-center"
          >
            {category.movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isPortrait={true} />
            ))}
             <div className="w-12 md:w-20 flex-none" />
          </div>

          {/* Navigation Buttons */}
          {isMoved && (
            <button 
                onClick={() => scroll('left')}
                className="hidden md:flex absolute left-0 top-0 bottom-0 w-12 bg-black/60 z-20 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
                <ChevronLeft className="text-white" size={30} />
            </button>
          )}
          
          <button 
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-0 bottom-0 w-12 bg-black/60 z-20 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          >
             <ChevronRight className="text-white" size={30} />
          </button>
      </div>
    </div>
  );
};

export default ReelRow;