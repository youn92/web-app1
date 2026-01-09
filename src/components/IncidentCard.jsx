import React from 'react';
import { formatDate, getThreatLevelColor } from '../data/incidents';

const IncidentCard = ({ incident, onClick }) => {
  const threatLevelColor = getThreatLevelColor(incident.threatLevel);

  return (
    <div
      className="w-full bg-[#0a0a0f] border border-cyan-500/30 rounded-xl p-4 space-y-3 hover:border-cyan-500/50 transition-all cursor-pointer active:scale-[0.98]"
      onClick={onClick}
    >
      {/* En-tête avec titre et niveau de menace */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-white flex-1 line-clamp-2">
          {incident.title}
        </h3>
        <ThreatLevelBadge level={incident.threatLevel} color={threatLevelColor} />
      </div>

      {/* Source et date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <span>{incident.source}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{formatDate(incident.date)}</span>
        </div>
      </div>

      {/* Catégorie */}
      <div>
        <CategoryBadge category={incident.category} />
      </div>

      {/* Résumé */}
      <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
        {incident.summary}
      </p>
    </div>
  );
};

const ThreatLevelBadge = ({ level, color }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold text-black ${color} whitespace-nowrap`}
    >
      {level}
    </span>
  );
};

const CategoryBadge = ({ category }) => {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-400 border border-cyan-500/50">
      {category}
    </span>
  );
};

export default IncidentCard;
