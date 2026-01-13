import React, { useState } from 'react';
import { useIncidents } from './hooks/useIncidents';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import IncidentCard from './components/IncidentCard';
import IncidentModal from './components/IncidentModal';
import EmptyState from './components/EmptyState';
import LoadingSpinner from './components/LoadingSpinner';
import LiveBadge from './components/LiveBadge';
import ViewersCounter from './components/ViewersCounter'; // Import du nouveau compteur réel

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
    <div className="min-h-screen bg-[#050507] text-white selection:bg-cyan-500/30">
      {/* Badge indicateur de nouveaux flux RSS */}
      <LiveBadge isVisible={hasNewIncidents} />

      {/* Header avec grille à 3 colonnes pour le centrage */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
          <div className="grid grid-cols-3 items-center">
            
            {/* GAUCHE : Compteur de spectateurs connecté à la DB */}
            <div className="flex items-center">
              <ViewersCounter />
            </div>

            {/* MILIEU : Titre Cybnews parfaitement centré */}
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase inline-block">
                Cybnews
              </h1>
            </div>
            
            {/* DROITE : Bouton Filtre interactif */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border transition-all duration-300 ${
                  showFilters 
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        {/* Barre de Recherche */}
        <section className="relative z-20">
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </section>

        {/* Panneau de Filtres (Nettoyé du compteur simulé) */}
        {showFilters && !isLoading && (
          <section className="animate-in slide-in-from-top-4 fade-in duration-500">
            <FilterPanel
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedThreatLevel={selectedThreatLevel}
              setSelectedThreatLevel={setSelectedThreatLevel}
              categories={categories}
              threatLevels={threatLevels}
              clearFilters={clearFilters}
            />
          </section>
        )}

        {/* Liste des flux d'incidents */}
        <section className="min-h-[400px]">
          {isLoading ? (
            <LoadingSpinner showSkeletons={true} />
          ) : error ? (
            <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-10 text-center animate-in zoom-in-95 duration-300">
              <h3 className="text-red-400 text-lg font-bold mb-2 uppercase tracking-tight">Erreur de Sync</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">{error}</p>
            </div>
          ) : incidents.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {incidents.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onClick={() => handleIncidentClick(incident)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Pied de page */}
      <footer className="mt-20 py-10 border-t border-white/5 bg-black/40">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="font-black text-sm uppercase tracking-widest text-white opacity-50">Cybnews</span>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-[0.2em]">
            Threat Intelligence Center - Veille Institutionnelle Mondiale
          </p>
        </div>
      </footer>

      {/* Modale de détails */}
      <IncidentModal
        incident={selectedIncident}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;