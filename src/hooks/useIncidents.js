import { useState, useMemo, useEffect, useRef } from 'react';
import { IncidentCategory, ThreatLevel } from '../data/incidents';
import { fetchAllRSSFeeds, convertRSSItemToIncident, deduplicateIncidents } from '../services/multiRssService';
import { getIncidentsFromStorage, saveIncidentsToStorage, findNewIncidents } from '../utils/localStorage';

export const useIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNewIncidents, setHasNewIncidents] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedThreatLevel, setSelectedThreatLevel] = useState(null);
  const previousIncidentsRef = useRef([]);

  // Charge les incidents depuis le cache ou le réseau
  useEffect(() => {
    const loadIncidents = async () => {
      setIsLoading(true);
      setError(null);
      
      // Essaie de charger depuis le cache d'abord
      let cachedIncidents = getIncidentsFromStorage();
      if (cachedIncidents && cachedIncidents.length > 0) {
        setIncidents(cachedIncidents);
        previousIncidentsRef.current = cachedIncidents;
        setIsLoading(false);
      }

      try {
        // Récupère tous les flux RSS en parallèle
        const feedResults = await fetchAllRSSFeeds();
        
        // Convertit tous les articles en incidents
        let allIncidents = [];
        feedResults.forEach((result, sourceIndex) => {
          if (result.success && result.items) {
            const converted = result.items
              .slice(0, 30) // Limite à 30 articles par source
              .map((item, index) => convertRSSItemToIncident(item, result.source, index));
            allIncidents.push(...converted);
          }
        });

        // Dédoublonne les incidents
        const uniqueIncidents = deduplicateIncidents(allIncidents);

        // Trie par date (plus récent en premier)
        uniqueIncidents.sort((a, b) => b.date - a.date);

        // Limite à 50 incidents les plus récents
        const finalIncidents = uniqueIncidents.slice(0, 50);

        // Détecte les nouveaux incidents
        const newIncidents = findNewIncidents(previousIncidentsRef.current, finalIncidents);
        if (newIncidents.length > 0) {
          setHasNewIncidents(true);
          // Cache le badge après 10 secondes
          setTimeout(() => setHasNewIncidents(false), 10000);
        }

        // Sauvegarde dans le cache
        saveIncidentsToStorage(finalIncidents);
        
        setIncidents(finalIncidents);
        previousIncidentsRef.current = finalIncidents;
      } catch (err) {
        console.error('Erreur lors du chargement des incidents:', err);
        setError(err.message || 'Erreur lors du chargement des incidents');
        
        // En cas d'erreur, garde les incidents du cache s'ils existent
        if (!cachedIncidents || cachedIncidents.length === 0) {
          setIncidents([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadIncidents();

    // Rafraîchit les données toutes les 30 minutes
    const refreshInterval = setInterval(() => {
      loadIncidents();
    }, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const filteredIncidents = useMemo(() => {
    let filtered = [...incidents];

    // Filtre par recherche textuelle (optimisé et instantané)
    if (searchText.trim() !== '') {
      const searchLower = searchText.toLowerCase().trim();
      const searchTerms = searchLower.split(/\s+/); // Divise en mots-clés
      
      filtered = filtered.filter(incident => {
        const searchableText = `
          ${incident.title} 
          ${incident.summary} 
          ${incident.detailedSummary || ''} 
          ${incident.source} 
          ${incident.category} 
          ${incident.threatLevel}
          ${(incident.technologies || []).join(' ')}
          ${(incident.affectedCountries || []).join(' ')}
          ${(incident.vulnerabilities || []).join(' ')}
        `.toLowerCase();
        
        // Vérifie que tous les termes de recherche sont présents
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(incident => incident.category === selectedCategory);
    }

    // Filtre par niveau de menace
    if (selectedThreatLevel) {
      filtered = filtered.filter(incident => incident.threatLevel === selectedThreatLevel);
    }

    // Trier par date (plus récent en premier)
    return filtered.sort((a, b) => b.date - a.date);
  }, [incidents, searchText, selectedCategory, selectedThreatLevel]);

  const clearFilters = () => {
    setSearchText('');
    setSelectedCategory(null);
    setSelectedThreatLevel(null);
  };

  return {
    incidents: filteredIncidents,
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
    categories: Object.values(IncidentCategory),
    threatLevels: Object.values(ThreatLevel)
  };
};
