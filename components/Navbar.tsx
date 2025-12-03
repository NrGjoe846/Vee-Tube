import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Home, Upload, User, LogOut, Clapperboard, MonitorPlay, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', icon: <Home size={18} />, path: '/' },
    { name: 'Reels', icon: <Clapperboard size={18} />, path: '/categories' },
    { name: 'Upload', icon: <Upload size={18} />, path: '/upload' },
    { name: 'My Channel', icon: <MonitorPlay size={18} />, path: '/' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b ${isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-white/5 shadow-2xl' : 'bg-gradient-to-b from-black/90 to-transparent border-transparent'}`}>
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Logo & Main Navigation */}
        <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group relative z-10">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-red-600 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg shadow-blue-900/20">
                   <span className="text-white font-black text-xl tracking-tighter">Y</span>
                </div>
                <span className="text-2xl font-bold text-white tracking-tighter hidden md:block drop-shadow-md">
                    Yutify
                </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2 ml-4">
                {navLinks.map((link) => (
                    <Link 
                        key={link.name} 
                        to={link.path}
                        className={`group flex items-center gap-2 transition-all duration-300 text-sm font-medium relative px-4 py-2 rounded-full hover:bg-white/5 ${location.pathname === link.path ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}
                    >
                        <span className={`transition-colors duration-300 ${location.pathname === link.path ? 'text-red-500' : 'group-hover:text-red-500'}`}>{link.icon}</span>
                        <span>{link.name}</span>
                    </Link>
                ))}
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-6">
            <Link to="/upload" className="lg:hidden text-gray-400 hover:text-white p-2">
                <Upload size={22} />
            </Link>

            <Link to="/search" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                <Search size={22} />
            </Link>

            {isAuthenticated ? (
                 <div className="group relative">
                    <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                         <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 to-red-700 flex items-center justify-center text-xs font-bold overflow-hidden ring-2 ring-transparent group-hover:ring-white/20 transition-all shadow-md">
                             {user?.avatar ? <img src={user.avatar} alt="User" /> : user?.name.charAt(0).toUpperCase()}
                         </div>
                    </div>
                    
                    {/* Account Dropdown */}
                    <div className="absolute right-0 mt-4 w-64 glass-panel rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-top-right translate-y-2 group-hover:translate-y-0 z-50 border border-white/10">
                        <div className="absolute -top-1 right-4 w-3 h-3 bg-[#141414] rotate-45 border-l border-t border-white/10"></div>
                        <div className="px-5 py-4 border-b border-gray-700/50 mb-2 bg-white/5">
                            <p className="text-sm text-white font-bold truncate">{user?.name}</p>
                            <p className="text-xs text-blue-400 truncate mt-0.5">Premium Member</p>
                        </div>
                        <Link to="/" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                            <User size={16} /> Profile
                        </Link>
                        <Link to="/" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                            <MonitorPlay size={16} /> My Channel
                        </Link>
                        <div className="h-px bg-white/10 my-2 mx-4"></div>
                        <button onClick={logout} className="w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors rounded-b-xl">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                 </div>
            ) : (
                <Link to="/login" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transform hover:scale-105">
                    Sign In
                </Link>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;