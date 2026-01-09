import React, { useEffect } from 'react';
import { formatDate, getThreatLevelColor } from '../data/incidents';

const IncidentModal = ({ incident, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !incident) return null;

  const threatLevelColor = getThreatLevelColor(incident.threatLevel);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#0a0a0f] border-2 border-cyan-500/50 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-fade-in animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec bouton fermer */}
        <div className="sticky top-0 bg-[#0a0a0f] border-b border-cyan-500/30 px-4 sm:px-6 py-4 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {incident.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <ThreatLevelBadge level={incident.threatLevel} color={threatLevelColor} />
              <CategoryBadge category={incident.category} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-cyan-500/20 rounded-lg transition-all"
            aria-label="Fermer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {/* Informations générales */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
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
                  className="w-5 h-5"
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

            {/* Lien source */}
            {incident.sourceUrl ? (
              <a
                href={incident.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm underline"
              >
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span>Consulter la source : {incident.source}</span>
              </a>
            ) : (
              <div className="text-xs text-gray-500 italic">
                Source : {incident.source} (lien non disponible)
              </div>
            )}
          </div>

          {/* Résumé détaillé */}
          {incident.detailedSummary && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Résumé détaillé
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {incident.detailedSummary}
              </p>
            </div>
          )}

          {/* Technologies utilisées */}
          {incident.technologies && incident.technologies.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                Technologies utilisées
              </h3>
              <div className="flex flex-wrap gap-2">
                {incident.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pays impactés */}
          {incident.affectedCountries && incident.affectedCountries.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pays impactés
              </h3>
              <div className="flex flex-wrap gap-2">
                {incident.affectedCountries.map((country, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 text-sm"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Failles exploitées */}
          {incident.vulnerabilities && incident.vulnerabilities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Failles exploitées
              </h3>
              <div className="space-y-2">
                {incident.vulnerabilities.map((vuln, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm"
                  >
                    {vuln}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
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

export default IncidentModal;
