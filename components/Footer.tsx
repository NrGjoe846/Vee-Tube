import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f1014] pt-16 pb-8 px-4 md:px-12 border-t border-gray-800">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
            <h4 className="font-bold text-lg text-white mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-blue-500 cursor-pointer">About Us</li>
                <li className="hover:text-blue-500 cursor-pointer">Careers</li>
                <li className="hover:text-blue-500 cursor-pointer">Terms of Use</li>
                <li className="hover:text-blue-500 cursor-pointer">Privacy Policy</li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-lg text-white mb-4">View Website in</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><span className="text-gray-500">✓</span> English</li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-lg text-white mb-4">Need Help?</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-blue-500 cursor-pointer">Visit Help Center</li>
                <li className="hover:text-blue-500 cursor-pointer">Share Feedback</li>
            </ul>
        </div>
        <div>
            <h4 className="font-bold text-lg text-white mb-4">Connect with Us</h4>
            <div className="flex gap-4 mb-6">
                <div className="p-2 bg-gray-800 rounded hover:bg-blue-600 transition-colors cursor-pointer text-white">
                    <Facebook size={20} />
                </div>
                <div className="p-2 bg-gray-800 rounded hover:bg-blue-400 transition-colors cursor-pointer text-white">
                    <Twitter size={20} />
                </div>
                <div className="p-2 bg-gray-800 rounded hover:bg-pink-600 transition-colors cursor-pointer text-white">
                    <Instagram size={20} />
                </div>
            </div>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2024 StreamStar. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <img src="https://img10.hotstar.com/image/upload/f_auto,q_90,w_256/v1661346101/google-play-store" alt="Google Play" className="h-10 cursor-pointer" />
             <img src="https://img10.hotstar.com/image/upload/f_auto,q_90,w_256/v1661346021/ios-app-store" alt="App Store" className="h-10 cursor-pointer" />
          </div>
      </div>
    </footer>
  );
};

export default Footer;