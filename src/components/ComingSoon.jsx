import { useEffect, useState } from "react";

const ComingSoon = ({ tabName }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className={`text-center transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-[#113c5e] to-[#1e5a8a] rounded-full mx-auto flex items-center justify-center shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-ping"></div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center absolute top-0 right-0"></div>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-[#113c5e] mb-4">{tabName}</h2>
        <p className="text-slate-600 text-lg mb-6 max-w-md mx-auto">
          We're working hard to bring you an amazing experience. This feature will be available soon!
        </p>
        
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div 
              key={i}
              className="w-3 h-3 bg-[#113c5e] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;