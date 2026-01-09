import React from 'react';
import SkeletonCard from './SkeletonCard';

const LoadingSpinner = ({ message = 'Chargement des incidents...', showSkeletons = true }) => {
  if (showSkeletons) {
    // Affiche des skeleton screens pour un meilleur UX
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  // Spinner classique si showSkeletons est false
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-6">
      {/* Spinner animé avec design cyber */}
      <div className="relative">
        {/* Cercle externe */}
        <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full"></div>
        {/* Cercle animé */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 border-r-blue-400 rounded-full animate-spin"></div>
        {/* Point central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
      </div>
      
      {/* Message de chargement */}
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-cyan-400">{message}</p>
        <p className="text-sm text-gray-400">Récupération des dernières alertes de cybersécurité...</p>
      </div>

      {/* Barre de progression animée */}
      <div className="w-64 h-1 bg-cyan-500/20 rounded-full overflow-hidden relative">
        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
