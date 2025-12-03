import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Upload as UploadIcon, FileVideo, Image as ImageIcon, Mic, Radio, Smartphone, Video } from 'lucide-react';

const Upload: React.FC = () => {
  const [contentType, setContentType] = useState<'interview' | 'podcast' | 'reel' | 'live'>('interview');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const getIcon = () => {
      switch(contentType) {
          case 'interview': return <Video />;
          case 'podcast': return <Mic />;
          case 'reel': return <Smartphone />;
          case 'live': return <Radio />;
      }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-10 px-4 md:px-12">
      <Navbar />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Creator Studio</h1>
        <p className="text-gray-400 mb-8">Share your voice with the world on Medai.</p>

        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 md:p-10">
            
            {/* Category Selection */}
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Select Content Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { id: 'interview', label: 'Interview', icon: <Video size={20} /> },
                    { id: 'podcast', label: 'Podcast', icon: <Mic size={20} /> },
                    { id: 'reel', label: 'Reel (60s)', icon: <Smartphone size={20} /> },
                    { id: 'live', label: 'Go Live', icon: <Radio size={20} /> },
                ].map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setContentType(type.id as any)}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${contentType === type.id ? 'bg-red-600/10 border-red-500 text-red-500' : 'bg-[#1a1a1a] border-transparent text-gray-400 hover:bg-[#222]'}`}
                    >
                        {type.icon}
                        <span className="font-semibold text-sm">{type.label}</span>
                    </button>
                ))}
            </div>

            {/* Form Fields */}
            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Title</label>
                    <input 
                        type="text" 
                        className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-4 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
                        placeholder={contentType === 'live' ? "Event Name..." : "Video Title..."}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Description</label>
                    <textarea 
                        className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-4 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors h-32 resize-none"
                        placeholder="Describe your content..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Upload Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                            <ImageIcon size={24} />
                        </div>
                        <h4 className="font-bold text-white mb-1">Upload Thumbnail</h4>
                        <p className="text-xs text-gray-500">1280x720 recommended</p>
                    </div>

                    {contentType !== 'live' && (
                        <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                                <FileVideo size={24} />
                            </div>
                            <h4 className="font-bold text-white mb-1">Upload Video File</h4>
                            <p className="text-xs text-gray-500">MP4, MOV (Max 2GB)</p>
                            {contentType === 'reel' && <p className="text-xs text-red-400 mt-2 font-bold">Max Duration: 60s</p>}
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button type="button" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        {contentType === 'live' ? <Radio size={20} /> : <UploadIcon size={20} />}
                        {contentType === 'live' ? 'Start Live Stream' : 'Publish Content'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Upload;