import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { MOCK_POLITICAL_CONTENT } from '../constants';
import { Movie } from '../types';
import { ArrowLeft, Play, Plus, ThumbsUp, Share2, Sparkles, MessageCircle, Star } from 'lucide-react';
import { generateMovieInsight, getSmartRecommendations } from '../services/geminiService';
import api from '../services/api';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
        let foundMovie: Movie | undefined;
        try {
            const { data } = await api.get(`/videos/${id}`);
            foundMovie = data;
        } catch (e) {
            foundMovie = MOCK_POLITICAL_CONTENT.find(m => m.id === id);
        }

        if (foundMovie) {
            setMovie(foundMovie);
            window.scrollTo(0, 0);
            
            setGeneratingAi(true);
            Promise.all([
                generateMovieInsight(foundMovie.title),
                getSmartRecommendations(foundMovie.title)
            ]).then(([insight, recs]) => {
                setAiInsight(insight);
                setRecommendations(recs);
                setGeneratingAi(false);
            });
        }
        setLoading(false);
    };

    if (id) loadMovie();
  }, [id]);

  const getVideoSrc = (movie: Movie) => {
      if (movie.videoUrl.startsWith('http')) return movie.videoUrl;
      return `http://localhost:5000/api/stream/${movie.videoUrl}`;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0f1014] text-white">
        <div className="w-full max-w-md p-4 space-y-4">
             <div className="h-64 skeleton-shimmer rounded-xl"></div>
             <div className="h-8 skeleton-shimmer rounded w-3/4"></div>
             <div className="h-4 skeleton-shimmer rounded w-1/2"></div>
        </div>
    </div>
  );
  if (!movie) return <div className="h-screen flex items-center justify-center bg-[#0f1014] text-white">Movie not found</div>;

  return (
    <div className="min-h-screen bg-[#0f1014] relative overflow-x-hidden">
      <Navbar />
      
      {/* Ambient Animated Background Glow - Red and White */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-950/30 animate-pulse opacity-70"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-white/5 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Video Player Section - Full width top placement */}
      <div className="w-full h-[60vh] md:h-[85vh] bg-black relative group shadow-[0_50px_100px_rgba(0,0,0,0.9)] z-10">
         <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black z-10 pointer-events-none"></div>
         <video 
            src={getVideoSrc(movie)}
            poster={movie.coverUrl}
            controls
            autoPlay
            className="w-full h-full object-contain relative z-0 pt-16" // pt-16 to clear navbar when controls are active
         />
         <Link to="/" className="absolute top-24 left-6 md:left-12 bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full text-white transition-all z-30 hover:scale-110 border border-white/5 shadow-lg group-hover:opacity-100 opacity-0 transition-opacity duration-300">
            <ArrowLeft size={24} />
         </Link>
      </div>

      {/* Details Section */}
      <div className="px-4 md:px-16 py-8 max-w-[1800px] mx-auto relative z-20 -mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Col: Info */}
            <div className="lg:col-span-2 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-lg shadow-red-600/20">
                        {movie.type}
                    </div>
                    {movie.isOriginal && <span className="text-xs font-bold tracking-widest text-white uppercase bg-white/20 px-2 py-0.5 rounded">Medai Original</span>}
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[0.9] drop-shadow-2xl">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm md:text-base mb-8 font-medium">
                    <div className="flex items-center text-red-400 gap-1 drop-shadow-lg bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                        <Star fill="currentColor" size={14} />
                        <span className="font-bold">9.8</span>
                    </div>
                    <span>{movie.year}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>{movie.duration}</span>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span className="border border-white/20 px-2 rounded text-xs bg-white/5 backdrop-blur-md">{movie.rating}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 mb-12">
                    <button className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] ease-spring duration-300">
                        <Play fill="currentColor" size={24} /> 
                        <span className="text-lg">Resume</span>
                    </button>
                    <button className="group flex items-center gap-2 glass-panel text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all hover:scale-105 border border-white/10 hover:border-white/30 ease-spring duration-300">
                        <Plus size={22} className="group-hover:text-red-500 transition-colors" /> <span className="hidden md:inline">Watchlist</span>
                    </button>
                    <button className="group flex items-center gap-2 glass-panel text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all hover:scale-105 border border-white/10 hover:border-white/30 ease-spring duration-300">
                        <ThumbsUp size={22} className="group-hover:text-red-500 transition-colors" /> <span className="hidden md:inline">Like</span>
                    </button>
                    <button className="flex items-center gap-2 glass-panel text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all hover:scale-105 border border-white/10 hover:border-white/30 ease-spring duration-300">
                        <Share2 size={22} />
                    </button>
                </div>

                {/* AI Insight Block - Red Theme */}
                <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/20 to-black/40 p-8 mb-10 group hover:border-red-500/50 transition-colors shadow-2xl backdrop-blur-md">
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
                    {generatingAi && <div className="absolute inset-0 animate-shimmer opacity-10 z-0"></div>}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-red-400 font-bold mb-4">
                            <Sparkles size={18} className="animate-pulse" />
                            <span className="text-sm uppercase tracking-wider glow-text">Gemini AI Insight</span>
                        </div>
                        {generatingAi ? (
                            <div className="space-y-3">
                                <div className="h-4 skeleton-shimmer rounded w-3/4"></div>
                                <div className="h-4 skeleton-shimmer rounded w-1/2"></div>
                            </div>
                        ) : (
                            <p className="text-gray-100 italic leading-relaxed text-xl font-light drop-shadow-md">"{aiInsight}"</p>
                        )}
                    </div>
                </div>

                <div className="mb-10 p-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                    <h3 className="text-2xl font-bold text-white mb-4">Synopsis</h3>
                    <p className="text-gray-300 leading-8 text-lg font-light">{movie.description}</p>
                </div>
            </div>

            {/* Right Col: Recommendations */}
            <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="glass-panel rounded-2xl p-6 sticky top-24 shadow-2xl border-t border-white/10">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-3 text-lg">
                        <div className="p-2 bg-red-500/20 rounded-full text-red-400 ring-1 ring-red-500/50">
                             <MessageCircle size={20} />
                        </div>
                        AI Suggestions
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-10">
                        {generatingAi ? (
                             [1,2,3].map(i => <div key={i} className="h-8 w-24 skeleton-shimmer rounded-full"></div>)
                        ) : (
                             recommendations.map((rec, idx) => (
                                <span key={idx} className="px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-red-600 hover:border-red-600 transition-colors cursor-default hover-glow shadow-sm">
                                    {rec}
                                </span>
                             ))
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-white text-md font-bold">Up Next</h4>
                        <span className="text-xs text-red-400 font-semibold cursor-pointer hover:underline tracking-wider">VIEW ALL</span>
                    </div>

                    <div className="space-y-5">
                        {MOCK_POLITICAL_CONTENT.filter(m => m.id !== movie.id).slice(0, 3).map((m, idx) => (
                            <Link key={m.id} to={`/watch/${m.id}`} className="flex gap-4 group hover:bg-white/5 p-2 rounded-xl transition-colors border border-transparent hover:border-white/5">
                                <div className="w-36 aspect-video rounded-lg overflow-hidden relative shadow-lg">
                                    <div className="absolute inset-0 skeleton-shimmer -z-10"></div>
                                    <img src={m.coverUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play fill="white" size={20} className="text-white drop-shadow-md" />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white px-1.5 py-0.5 rounded backdrop-blur-sm">{m.duration}</div>
                                </div>
                                <div className="flex-1 py-1">
                                    <h5 className="text-gray-200 font-semibold text-sm group-hover:text-red-400 transition-colors line-clamp-1 leading-tight">{m.title}</h5>
                                    <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">{m.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] border border-gray-600 px-1 rounded text-gray-400">{m.rating}</span>
                                        <span className="text-[10px] text-gray-500">{m.year}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;