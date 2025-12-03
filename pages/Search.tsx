import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Search as SearchIcon } from 'lucide-react';
import { MOCK_POLITICAL_CONTENT } from '../constants';
import MovieCard from '../components/MovieCard';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');

  const filteredMovies = query 
    ? MOCK_POLITICAL_CONTENT.filter(m => m.title.toLowerCase().includes(query.toLowerCase()) || m.genre.some(g => g.toLowerCase().includes(query.toLowerCase())))
    : []; // Show popular or nothing initially

  return (
    <div className="min-h-screen bg-[#0f1014] pt-24 px-4 md:px-12">
      <Navbar />
      
      <div className="max-w-4xl mx-auto">
        <div className="relative mb-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" size={24} />
            </div>
            <input 
                type="text" 
                placeholder="Movies, shows and more" 
                className="w-full bg-[#192133] text-white text-xl pl-14 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder-gray-500 font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
            />
        </div>

        {query ? (
             <div>
                <h3 className="text-white text-lg font-bold mb-6">Results for "{query}"</h3>
                {filteredMovies.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-20">
                        <p className="text-xl">No results found.</p>
                        <p className="text-sm mt-2">Try searching for "Action", "Sci-Fi", or specific titles.</p>
                    </div>
                )}
             </div>
        ) : (
            <div>
                 <h3 className="text-white text-lg font-bold mb-6">Popular Searches</h3>
                 <div className="flex flex-wrap gap-3">
                    {['Action Movies', 'Sci-Fi', 'Interstellar', '2024 Hits', 'Drama'].map(tag => (
                        <button 
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className="bg-[#252833] hover:bg-[#323645] text-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        >
                            {tag}
                        </button>
                    ))}
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Search;