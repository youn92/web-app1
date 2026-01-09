import React, { useState, useMemo } from 'react';
import { useIncidents } from './hooks/useIncidents';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import IncidentCard from './components/IncidentCard';
import IncidentModal from './components/IncidentModal';
import EmptyState from './components/EmptyState';
import LoadingSpinner from './components/LoadingSpinner';
import LiveBadge from './components/LiveBadge';

function App() {
  const {
    incidents,
    isLoading,
    error,
    hasNewIncidents,
    searchText,
    setSearchText,
    selectedCategory,
    setSelectedCategory,
    selectedThreatLevel,
    setSelectedThreatLevel,
    clearFilters,
    categories,
    threatLevels
  } = useIncidents();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIncidentClick = (incident) => {
    setSelectedIncident(incident);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIncident(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Badge LIVE */}
      <LiveBadge isVisible={hasNewIncidents} />

      {/* En-tête */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Incidents Cyber
            </h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              aria-label="Toggle filters"
            >
              <svg
                className={`w-6 h-6 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-4">
        {/* Barre de recherche */}
        <SearchBar searchText={searchText} setSearchText={setSearchText} />

        {/* Panneau de filtres (repliable) */}
        {showFilters && !isLoading && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <FilterPanel
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedThreatLevel={selectedThreatLevel}
              setSelectedThreatLevel={setSelectedThreatLevel}
              categories={categories}
              threatLevels={threatLevels}
              clearFilters={clearFilters}
            />
          </div>
        )}

        {/* État de chargement avec skeleton screens */}
        {isLoading && <LoadingSpinner showSkeletons={true} />}

        {/* Message d'erreur */}
        {error && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center space-y-3">
            <div className="text-red-400 text-lg font-semibold">
              Erreur de chargement
            </div>
            <p className="text-gray-300 text-sm">{error}</p>
            <p className="text-gray-400 text-xs">
              Vérifiez votre connexion internet ou réessayez plus tard.
            </p>
          </div>
        )}

        {/* Liste des incidents */}
        {!isLoading && !error && (
          incidents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onClick={() => handleIncidentClick(incident)}
                />
              ))}
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-400 space-y-1">
          <p>Cyber Security Tracker - Suivi des incidents de cybersécurité</p>
          <p className="text-xs text-gray-500">
            Données agrégées depuis : The Hacker News, Bleeping Computer, CERT-FR (ANSSI)
          </p>
        </div>
      </footer>

      {/* Modal de détails */}
      <IncidentModal
        incident={selectedIncident}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
