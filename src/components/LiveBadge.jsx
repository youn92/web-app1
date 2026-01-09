import React from 'react';

const LiveBadge = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-16 sm:top-4 right-2 sm:right-4 z-50 animate-fade-in">
      <div className="relative">
        {/* Badge principal */}
        <div className="bg-red-500/90 backdrop-blur-sm border-2 border-red-400 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 shadow-lg">
          {/* Point rouge clignotant */}
          <div className="relative w-2.5 h-2.5 sm:w-3 sm:h-3">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-red-500 rounded-full"></div>
          </div>
          
          {/* Texte LIVE */}
          <span className="text-white text-xs font-bold tracking-wider">LIVE</span>
          
          {/* Effet de glow */}
          <div className="absolute inset-0 bg-red-400/50 rounded-full blur-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LiveBadge;
