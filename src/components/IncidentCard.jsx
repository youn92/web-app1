import React from 'react';
import { formatDate, getThreatLevelColor } from '../data/incidents';

const IncidentCard = ({ incident, onClick }) => {
  const threatLevelColor = getThreatLevelColor(incident.threatLevel);

  // Fonction pour styliser le badge de la source
  const getSourceStyle = (source) => {
    const s = source ? source.toLowerCase() : '';
    if (s.includes('nvd') || s.includes('nist')) return 'bg-blue-900/40 text-blue-300 border-blue-500/50';
    if (s.includes('google')) return 'bg-green-900/40 text-green-300 border-green-500/50';
    if (s.includes('microsoft')) return 'bg-indigo-900/40 text-indigo-300 border-indigo-500/50';
    if (s.includes('exploit')) return 'bg-red-900/40 text-red-300 border-red-500/50';
    return 'bg-gray-800/40 text-gray-300 border-gray-600/50';
  };

  return (
    <div
      className="w-full bg-[#0a0a0f] border border-cyan-500/30 rounded-xl p-4 space-y-3 hover:border-cyan-500/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all cursor-pointer active:scale-[0.99]"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-white flex-1 line-clamp-2 tracking-tight">
          {incident.title}
        </h3>
        {/* Badge mis à jour avec le texte "Risque" */}
        <ThreatLevelBadge level={incident.threatLevel} color={threatLevelColor} />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
        <span className={`px-2 py-0.5 rounded border font-mono text-[10px] uppercase ${getSourceStyle(incident.source)}`}>
          {incident.source}
        </span>
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatDate(incident.date)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <CategoryBadge category={incident.category} />
      </div>

      <p className="text-sm text-gray-400 line-clamp-2 italic border-l-2 border-cyan-500/20 pl-3">
        {incident.summary}
      </p>
    </div>
  );
};

const ThreatLevelBadge = ({ level, color }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-black ${color} whitespace-nowrap shadow-sm`}>
    Risque {level}
  </span>
);

const CategoryBadge = ({ category }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
    {category}
  </span>
);

export default IncidentCard;