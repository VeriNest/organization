import { useState } from "react";

const TwitterMissionPopup = ({ onComplete, onClose }) => {
  const [hasFollowed, setHasFollowed] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl max-w-md w-full mx-4 border border-slate-700 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#113c5e] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.027 10.027 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Follow VeriNest on X</h2>
          <p className="text-slate-300">Complete this mission to earn 5 VTS tokens</p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg mb-6">
          <p className="text-slate-200 text-sm mb-3">Follow our official X account to stay updated with the latest news and announcements.</p>
          <div className="flex items-center justify-between bg-slate-600 p-3 rounded">
            <span className="text-white font-medium">@VeriNest_org</span>
            <span className="text-blue-400">✓ Verified</span>
          </div>
        </div>
        
        <a 
          href="https://x.com/VeriNest_org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-[#113c5e] hover:bg-[#0c2a44] text-white py-3 rounded-full text-center mb-3 transition-all duration-300 font-medium"
          onClick={() => setHasFollowed(true)}
        >
          Open X Profile
        </a>
        
        <button 
          onClick={onComplete}
          disabled={!hasFollowed}
          className={`w-full py-3 rounded-full font-medium transition-all duration-300 ${
            hasFollowed 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg transform hover:scale-105' 
              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
          }`}
        >
          {hasFollowed ? 'Complete Mission' : 'Please follow first'}
        </button>
        
        <button 
          onClick={onClose}
          className="w-full mt-4 text-slate-400 hover:text-slate-300 transition-colors duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TwitterMissionPopup;