import { IncidentCategory, ThreatLevel } from '../data/incidents';

// Proxy pour contourner les restrictions CORS des navigateurs
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

// --- LISTE MASSIVE DES SOURCES DE CYBERSÉCURITÉ ---
export const RSS_SOURCES = [
  // Sources Institutionnelles & Bases de Données
  { name: 'NIST NVD', url: 'https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss.xml' },
  { name: 'US-CERT (CISA)', url: 'https://www.cisa.gov/cybersecurity-advisories.xml' },
  { name: 'CERT-FR (ANSSI)', url: 'https://www.cert.ssi.gouv.fr/feed/' },
  { name: 'MITRE CVE', url: 'https://cve.mitre.org/data/downloads/allitems.xml' },
  
  // Recherche Avancée & Exploits
  { name: 'Google Project Zero', url: 'https://googleprojectzero.blogspot.com/feeds/posts/default' },
  { name: 'Exploit-DB', url: 'https://www.exploit-db.com/rss.xml' },
  { name: 'Zero Day Initiative', url: 'https://www.zerodayinitiative.com/advisories/rss/' },
  { name: 'Packet Storm', url: 'https://packetstormsecurity.com/feeds/advisories/' },
  { name: 'VulnMonitor', url: 'https://vulnmonitor.org/feed/' },
  
  // Constructeurs & Éditeurs
  { name: 'Microsoft MSRC', url: 'https://msrc.microsoft.com/blog/feed' },
  { name: 'Red Hat Security', url: 'https://access.redhat.com/security/security-updates/#/rss' },
  
  // Communauté & News
  { name: 'Reddit r/netsec', url: 'https://www.reddit.com/r/netsec/.rss' },
  { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
  { name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/feed/' }
];

/**
 * Récupère tous les flux en parallèle
 */
export const fetchAllRSSFeeds = async () => {
  const promises = RSS_SOURCES.map(source => 
    fetch(`${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(source.url)}`)
      .then(res => res.json())
      .then(data => ({ 
        source: source.name, 
        items: data.status === 'ok' ? data.items : [], 
        success: data.status === 'ok' 
      }))
      .catch(error => ({ source: source.name, items: [], success: false, error }))
  );
  return await Promise.all(promises);
};

// Nettoyage HTML
const cleanHTML = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') 
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
};

// Logique de Scoring Automatique (NVD Score -> Threat Level)
const determineThreatLevel = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  // Détection NVD/CVSS si présent dans le texte
  if (text.includes('cvss 9') || text.includes('cvss 10') || text.includes('critical')) return ThreatLevel.CRITICAL;
  if (text.includes('cvss 7') || text.includes('cvss 8') || text.includes('high')) return ThreatLevel.HIGH;
  
  // Définition Niveau Moyen demandée
  if (text.includes('medium') || text.includes('moderate') || text.includes('local access') || text.includes('user interaction')) {
    return ThreatLevel.MEDIUM;
  }
  
  if (text.includes('low')) return ThreatLevel.LOW;
  
  // Par défaut, critique pour les ransomwares, moyen pour le reste
  if (text.includes('ransomware') || text.includes('zero-day')) return ThreatLevel.CRITICAL;
  
  return ThreatLevel.MEDIUM;
};

// Catégorisation
const categorizeIncident = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('ransomware')) return IncidentCategory.RANSOMWARE;
  if (text.includes('phishing')) return IncidentCategory.PHISHING;
  if (text.includes('leak') || text.includes('breach')) return IncidentCategory.DATA_BREACH;
  // Par défaut, tout ce qui vient de NVD/MITRE est une Vulnérabilité
  return 'Vulnérabilité'; 
};

// Extraction de métadonnées
const extractMetadata = (text) => {
  const cveRegex = /CVE-\d{4}-\d+/gi;
  const techKeywords = ['Windows', 'Linux', 'Android', 'iOS', 'Cisco', 'Fortinet', 'Oracle', 'Exchange', 'Chrome'];
  
  return {
    vulnerabilities: [...new Set(text.match(cveRegex))].slice(0, 3),
    // CORRECTION ICI : suppression du "QD" parasite
    technologies: techKeywords.filter(tech => text.toLowerCase().includes(tech.toLowerCase()))
  };
};

export const convertRSSItemToIncident = (item, sourceName, index) => {
  const cleanDescription = cleanHTML(item.description || item.content || '');
  const metadata = extractMetadata(`${item.title} ${cleanDescription}`);

  return {
    id: `${sourceName.replace(/\s+/g, '')}-${index}-${Date.now()}`,
    title: item.title,
    source: sourceName,
    sourceUrl: item.link,
    date: item.pubDate ? new Date(item.pubDate) : new Date(),
    summary: cleanDescription.substring(0, 200) + '...',
    detailedSummary: cleanDescription,
    threatLevel: determineThreatLevel(item.title, cleanDescription),
    category: categorizeIncident(item.title, cleanDescription),
    technologies: metadata.technologies,
    affectedCountries: ['Monde'],
    vulnerabilities: metadata.vulnerabilities.length > 0 ? metadata.vulnerabilities : ['Non spécifié']
  };
};

export const deduplicateIncidents = (incidents) => {
  const seen = new Set();
  return incidents.filter(i => {
    const key = i.title.toLowerCase().substring(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};