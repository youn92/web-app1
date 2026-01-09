const STORAGE_KEY = 'cyber_security_incidents';
const STORAGE_TIMESTAMP_KEY = 'cyber_security_incidents_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes en millisecondes

/**
 * Sauvegarde les incidents dans le LocalStorage
 */
export const saveIncidentsToStorage = (incidents) => {
  try {
    const data = {
      incidents: incidents.map(incident => ({
        ...incident,
        date: incident.date.toISOString() // Convertit la date en string pour le stockage
      })),
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans LocalStorage:', error);
  }
};

/**
 * Récupère les incidents depuis le LocalStorage
 */
export const getIncidentsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    
    if (!stored || !timestamp) {
      return null;
    }

    const data = JSON.parse(stored);
    const cacheAge = Date.now() - parseInt(timestamp, 10);

    // Vérifie si le cache est encore valide (moins de 30 minutes)
    if (cacheAge > CACHE_DURATION) {
      return null; // Cache expiré
    }

    // Convertit les dates string en objets Date
    const incidents = data.incidents.map(incident => ({
      ...incident,
      date: new Date(incident.date)
    }));

    return incidents;
  } catch (error) {
    console.error('Erreur lors de la récupération depuis LocalStorage:', error);
    return null;
  }
};

/**
 * Compare deux listes d'incidents pour détecter les nouveaux
 */
export const findNewIncidents = (oldIncidents, newIncidents) => {
  if (!oldIncidents || oldIncidents.length === 0) {
    return newIncidents; // Tous sont nouveaux si pas d'anciens incidents
  }

  const oldIds = new Set(oldIncidents.map(inc => inc.id));
  return newIncidents.filter(inc => !oldIds.has(inc.id));
};

/**
 * Marque un incident comme lu
 */
export const markIncidentAsRead = (incidentId) => {
  try {
    const readIncidents = JSON.parse(localStorage.getItem('read_incidents') || '[]');
    if (!readIncidents.includes(incidentId)) {
      readIncidents.push(incidentId);
      localStorage.setItem('read_incidents', JSON.stringify(readIncidents));
    }
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error);
  }
};

/**
 * Vérifie si un incident a été lu
 */
export const isIncidentRead = (incidentId) => {
  try {
    const readIncidents = JSON.parse(localStorage.getItem('read_incidents') || '[]');
    return readIncidents.includes(incidentId);
  } catch (error) {
    return false;
  }
};
