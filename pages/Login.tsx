import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await login(email, password || 'demo123'); // Allow passwordless for demo logic compatibility
        navigate('/');
    } catch (err: any) {
        setError(err.response?.data?.message || 'Login failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1014] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with blend mode */}
      <div className="absolute inset-0 bg-cover bg-center animate-zoom-slow" style={{ backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/f85718e1-fc6d-4954-bca0-f5eaf78e0842/ea44b42b-ba19-4f35-ad27-45090e34a897/US-en-20230918-popsignuptwoweeks-perspective_alpha_website_large.jpg)' }}></div>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      {/* Glow Orbs - Red and White */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative glass-panel p-10 md:p-16 rounded-2xl shadow-2xl w-full max-w-[500px] border border-white/10 animate-fade-in-up">
        <button onClick={() => navigate('/')} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-300">
            <X size={28} />
        </button>

        <h2 className="text-4xl font-bold text-white mb-3">Welcome to Medai</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">Enter your credentials to access unfiltered news.</p>
        
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded text-sm mb-4 border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-red-500 transition-colors">Email Address</label>
                <input 
                    type="email" 
                    required
                    className="w-full bg-[#0f1014]/50 border border-gray-600 text-white rounded-lg p-4 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all placeholder-gray-600"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-red-500 transition-colors">Password</label>
                <input 
                    type="password" 
                    className="w-full bg-[#0f1014]/50 border border-gray-600 text-white rounded-lg p-4 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all placeholder-gray-600"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-red-600/30 relative overflow-hidden group">
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-shimmer"></div>
            </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
            New to Medai? <Link to="/signup" className="text-white hover:text-red-500 font-semibold transition-colors">Sign up now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;