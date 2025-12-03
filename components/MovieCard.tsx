import React, { useState, useRef } from 'react';
import { Movie } from '../types';
import { Play, Plus, ThumbsUp, MoreVertical, Signal } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
  isPortrait?: boolean; // For Reels
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isPortrait = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
        setIsHovered(true);
    }, 400); 
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHovered(false);
  };

  const aspectRatioClass = isPortrait ? 'aspect-[9/16] w-[140px] md:w-[200px]' : 'aspect-video w-[220px] md:w-[320px]';

  return (
    <div 
        className={`relative flex-none ${aspectRatioClass} transition-all duration-300 z-0 hover:z-50`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        {/* Default Card (Static) */}
        <div className={`w-full h-full rounded bg-[#192133] transition-all duration-300 relative overflow-hidden group ${isHovered && !isPortrait ? 'opacity-0' : 'opacity-100 hover:scale-[1.03]'}`}>
            {!isImageLoaded && <div className="absolute inset-0 skeleton-shimmer z-10"></div>}
            <img 
                src={movie.thumbnailUrl} 
                alt={movie.title} 
                className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setIsImageLoaded(true)}
            />
            
            {/* Live Badge */}
            {movie.type === 'live' && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 animate-pulse shadow-lg z-20">
                    <Signal size={10} /> LIVE
                </div>
            )}

            {/* Gradient Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3">
                 <h4 className="text-white font-bold text-sm truncate">{movie.title}</h4>
                 <div className="flex items-center gap-2 text-[10px] text-gray-300 mt-1">
                     <span className="text-red-500 font-semibold">{movie.channelName}</span>
                     {movie.views && <span>• {movie.views}</span>}
                 </div>
            </div>
        </div>

        {/* Hover Pop-out Card (Standard Video Only) */}
        {isHovered && !isPortrait && (
            <div className="absolute top-[-50%] left-[-10%] w-[120%] bg-[#141414] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden scale-100 animate-in fade-in duration-300 origin-center ring-1 ring-white/10 z-50 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                
                {/* Image Section */}
                <div className="relative aspect-video w-full">
                    <img 
                        src={movie.thumbnailUrl} 
                        alt={movie.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Link to={`/watch/${movie.id}`} className="bg-red-600 rounded-full p-3 shadow-lg transform hover:scale-110 transition-transform">
                            <Play fill="white" size={20} className="ml-1 text-white" />
                        </Link>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-4 flex flex-col justify-between bg-[#141414]">
                    <div className="flex items-center justify-between mb-3">
                         <div className="flex gap-2">
                             <button className="w-8 h-8 rounded-full border border-gray-600 hover:border-red-500 text-gray-300 hover:text-red-500 flex items-center justify-center transition-all bg-[#1a1a1a]">
                                <Plus size={16} />
                             </button>
                             <button className="w-8 h-8 rounded-full border border-gray-600 hover:border-red-500 text-gray-300 hover:text-red-500 flex items-center justify-center transition-all bg-[#1a1a1a]">
                                <ThumbsUp size={14} />
                             </button>
                         </div>
                         <div className="text-xs text-red-500 font-bold border border-red-500/30 px-2 py-0.5 rounded">Trending</div>
                    </div>

                    <div>
                        <h3 className="font-bold text-white text-sm mb-1 line-clamp-1">{movie.title}</h3>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium mb-2">
                            <span className="text-white font-semibold">{movie.channelName}</span>
                            <span>•</span>
                            <span>{movie.duration}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {movie.genre.slice(0, 3).map(g => (
                                <span key={g} className="text-[9px] border border-gray-700 px-1.5 py-0.5 rounded text-gray-400">{g}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default MovieCard;