import React from 'react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 space-y-5">
      <div className="text-cyan-400/50">
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">Aucun incident trouvé</h3>
        <p className="text-sm text-gray-400 max-w-xs">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
