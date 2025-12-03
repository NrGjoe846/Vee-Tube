
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { X } from 'lucide-react';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await register(name, email, password);
        navigate('/');
    } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1014] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with blend mode */}
      <div className="absolute inset-0 bg-cover bg-center animate-zoom-slow" style={{ backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/f85718e1-fc6d-4954-bca0-f5eaf78e0842/ea44b42b-ba19-4f35-ad27-45090e34a897/US-en-20230918-popsignuptwoweeks-perspective_alpha_website_large.jpg)' }}></div>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-600/30 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative glass-panel p-10 md:p-16 rounded-2xl shadow-2xl w-full max-w-[500px] border border-white/10 animate-fade-in-up">
        <button onClick={() => navigate('/')} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors hover:rotate-90 duration-300">
            <X size={28} />
        </button>

        <h2 className="text-4xl font-bold text-white mb-3">Create Account</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">Join millions of streamers today.</p>
        
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded text-sm mb-4 border border-red-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-400 transition-colors">Full Name</label>
                <input 
                    type="text" 
                    required
                    className="w-full bg-[#0f1014]/50 border border-gray-600 text-white rounded-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder-gray-600"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-400 transition-colors">Email Address</label>
                <input 
                    type="email" 
                    required
                    className="w-full bg-[#0f1014]/50 border border-gray-600 text-white rounded-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder-gray-600"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-focus-within:text-blue-400 transition-colors">Password</label>
                <input 
                    type="password" 
                    required
                    className="w-full bg-[#0f1014]/50 border border-gray-600 text-white rounded-lg p-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder-gray-600"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-600/30 relative overflow-hidden group">
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-shimmer"></div>
            </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-white hover:text-blue-400 font-semibold transition-colors">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;