import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="w-full bg-[#0a0a0f] border border-cyan-500/30 rounded-xl p-4 space-y-3 animate-pulse">
      {/* Titre skeleton */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-cyan-500/20 rounded w-3/4"></div>
          <div className="h-5 bg-cyan-500/20 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-20 bg-cyan-500/20 rounded-full"></div>
      </div>

      {/* Source et date skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-cyan-500/20 rounded w-32"></div>
        <div className="h-4 bg-cyan-500/20 rounded w-24"></div>
      </div>

      {/* Catégorie skeleton */}
      <div className="h-6 w-24 bg-cyan-500/20 rounded-full"></div>

      {/* Résumé skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-cyan-500/20 rounded w-full"></div>
        <div className="h-4 bg-cyan-500/20 rounded w-5/6"></div>
        <div className="h-4 bg-cyan-500/20 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
