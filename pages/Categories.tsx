import React from 'react';
import Navbar from '../components/Navbar';
import { Mic, Video, Radio, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import MovieRow from '../components/MovieRow';
import { MOCK_CATEGORIES } from '../constants';

const Categories: React.FC = () => {
  const catButtons = [
    { name: 'Podcasts', icon: <Mic size={24} />, color: 'bg-purple-600', link: '#podcasts' },
    { name: 'Interviews', icon: <Video size={24} />, color: 'bg-blue-600', link: '#interviews' },
    { name: 'Live News', icon: <Radio size={24} />, color: 'bg-red-600', link: '#live' },
    { name: 'Reels', icon: <Smartphone size={24} />, color: 'bg-pink-600', link: '#reels' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 px-4 md:px-12">
      <Navbar />
      
      <h1 className="text-3xl font-bold text-white mb-8">Browse by Category</h1>

      {/* Category Buttons Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {catButtons.map((btn) => (
            <Link 
                key={btn.name} 
                to={btn.link}
                className={`group relative h-32 rounded-xl overflow-hidden flex flex-col items-center justify-center gap-3 border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]`}
            >
                <div className={`absolute inset-0 ${btn.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                <div className="relative z-10 bg-white/10 p-3 rounded-full backdrop-blur-sm">
                    {btn.icon}
                </div>
                <span className="relative z-10 font-bold text-lg">{btn.name}</span>
            </Link>
        ))}
      </div>

      {/* Example Content for Categories */}
      <div className="space-y-12">
         {MOCK_CATEGORIES.map(cat => (
             <MovieRow key={cat.id} category={cat} />
         ))}
      </div>
    </div>
  );
};

export default Categories;