import React from 'react';

const FilterPanel = ({
  selectedCategory, setSelectedCategory,
  selectedThreatLevel, setSelectedThreatLevel,
  categories, threatLevels, clearFilters
}) => {
  return (
    <div className="w-full bg-[#0a0a0f] border border-cyan-500/30 rounded-xl p-5 space-y-6 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      
      {/* En-tête des filtres simplifié */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">
          Filtres
        </h3>
      </div>

      {/* Filtres Catégories */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Type d'incident</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${!selectedCategory ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
          >
            TOUS
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filtres Niveaux */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Niveau de menace</label>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedThreatLevel(null)} 
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${!selectedThreatLevel ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-gray-700 text-gray-500'}`}
          >
            TOUS
          </button>
          {threatLevels.map(level => (
            <button
              key={level}
              onClick={() => setSelectedThreatLevel(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedThreatLevel === level ? 'bg-white/10 border-white text-white' : 'border-gray-700 text-gray-500'}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Bouton Reset */}
      <div className="pt-2">
        <button onClick={clearFilters} className="w-full py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors uppercase font-bold tracking-widest">
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
