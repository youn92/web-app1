import React from 'react';
import { IncidentCategory, ThreatLevel, getThreatLevelColor } from '../data/incidents';

const FilterPanel = ({
  selectedCategory,
  setSelectedCategory,
  selectedThreatLevel,
  setSelectedThreatLevel,
  categories,
  threatLevels,
  clearFilters
}) => {
  const hasActiveFilters = selectedCategory || selectedThreatLevel;

  const getThreatLevelBgColor = (level) => {
    switch (level) {
      case ThreatLevel.LOW:
        return 'bg-green-500/30 border-green-500/80 text-green-400';
      case ThreatLevel.MEDIUM:
        return 'bg-yellow-500/30 border-yellow-500/80 text-yellow-400';
      case ThreatLevel.HIGH:
        return 'bg-orange-500/30 border-orange-500/80 text-orange-400';
      case ThreatLevel.CRITICAL:
        return 'bg-red-500/30 border-red-500/80 text-red-400';
      default:
        return 'bg-gray-500/30 border-gray-500/80 text-gray-400';
    }
  };

  return (
    <div className="w-full bg-[#0a0a0f] border border-cyan-500/30 rounded-xl p-4 space-y-4">
      {/* En-tête avec bouton réinitialiser */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-cyan-400">Filtres</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Filtre par catégorie */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Catégorie</label>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Toutes"
            isSelected={!selectedCategory}
            onClick={() => setSelectedCategory(null)}
            color="cyan"
          />
          {categories.map((category) => (
            <FilterChip
              key={category}
              label={category}
              isSelected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              color="cyan"
            />
          ))}
        </div>
      </div>

      {/* Filtre par niveau de menace */}
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Niveau de menace</label>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Tous"
            isSelected={!selectedThreatLevel}
            onClick={() => setSelectedThreatLevel(null)}
            color="blue"
          />
          {threatLevels.map((level) => (
            <FilterChip
              key={level}
              label={level}
              isSelected={selectedThreatLevel === level}
              onClick={() => setSelectedThreatLevel(level)}
              customClass={getThreatLevelBgColor(level)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterChip = ({ label, isSelected, onClick, color = 'cyan', customClass }) => {
  const getColorClasses = () => {
    if (customClass) return customClass;
    if (!isSelected) return 'bg-transparent border-gray-500/30 text-gray-400 hover:border-gray-500/50';
    
    switch (color) {
      case 'cyan':
        return 'bg-cyan-500/30 border-cyan-500/80 text-cyan-400';
      case 'blue':
        return 'bg-blue-500/30 border-blue-500/80 text-blue-400';
      default:
        return 'bg-cyan-500/30 border-cyan-500/80 text-cyan-400';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-xs font-semibold border transition-all ${getColorClasses()}`}
    >
      {label}
    </button>
  );
};

export default FilterPanel;
