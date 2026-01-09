import { IncidentCategory, ThreatLevel } from '../data/incidents';

// Service RSS-to-JSON (utilise rss2json.com comme proxy pour éviter CORS)
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

// Configuration des sources RSS
export const RSS_SOURCES = [
  {
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    sourceName: 'The Hacker News'
  },
  {
    name: 'Bleeping Computer',
    url: 'https://www.bleepingcomputer.com/feed/',
    sourceName: 'Bleeping Computer'
  },
  {
    name: 'CERT-FR (ANSSI)',
    url: 'https://www.cert.ssi.gouv.fr/alerte/feed/',
    sourceName: 'CERT-FR'
  }
];

/**
 * Récupère un flux RSS via le proxy rss2json
 */
const fetchRSSFeed = async (rssUrl) => {
  try {
    const response = await fetch(
      `${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(rssUrl)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(data.message || 'Erreur lors de la récupération du flux RSS');
    }

    return data.items || [];
  } catch (error) {
    console.error(`Erreur lors de la récupération du RSS (${rssUrl}):`, error);
    throw error;
  }
};

/**
 * Récupère tous les flux RSS en parallèle
 */
export const fetchAllRSSFeeds = async () => {
  const promises = RSS_SOURCES.map(source => 
    fetchRSSFeed(source.url)
      .then(items => ({ source: source.sourceName, items, success: true }))
      .catch(error => ({ source: source.sourceName, items: [], success: false, error }))
  );

  const results = await Promise.all(promises);
  return results;
};

/**
 * Nettoie le HTML d'une description
 */
const cleanHTML = (html) => {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '') // Supprime les balises HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalise les espaces
    .trim();
};

/**
 * Auto-scoring : Force CRITICAL si certains mots-clés sont présents
 */
const applyAutoScoring = (title, description, baseThreatLevel) => {
  const text = `${title} ${description}`.toLowerCase();
  const criticalKeywords = ['ransomware', 'critical', 'zero-day', 'vulnerability', 'exploited'];
  
  const hasCriticalKeyword = criticalKeywords.some(keyword => 
    text.includes(keyword)
  );

  if (hasCriticalKeyword) {
    return ThreatLevel.CRITICAL;
  }

  return baseThreatLevel;
};

/**
 * Détermine la catégorie d'un incident
 */
const categorizeIncident = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('ransomware') || text.includes('lockbit') || text.includes('wannacry') || text.includes('wanna cry')) {
    return IncidentCategory.RANSOMWARE;
  }
  if (text.includes('data breach') || text.includes('data leak') || text.includes('exposed') || text.includes('leaked') || text.includes('violation')) {
    return IncidentCategory.DATA_BREACH;
  }
  if (text.includes('phishing') || text.includes('scam') || text.includes('fraud') || text.includes('smishing')) {
    return IncidentCategory.PHISHING;
  }
  
  return IncidentCategory.RANSOMWARE; // Par défaut
};

/**
 * Détermine le niveau de menace de base
 */
const determineBaseThreatLevel = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('critical') || text.includes('zero-day') || text.includes('hospital') || text.includes('infrastructure') || text.includes('critical')) {
    return ThreatLevel.CRITICAL;
  }
  if (text.includes('high') || text.includes('major') || text.includes('millions') || text.includes('millions')) {
    return ThreatLevel.HIGH;
  }
  if (text.includes('medium') || text.includes('moderate')) {
    return ThreatLevel.MEDIUM;
  }
  
  return ThreatLevel.MEDIUM;
};

/**
 * Extrait les technologies mentionnées
 */
const extractTechnologies = (description) => {
  const technologies = [];
  const techKeywords = [
    'Windows', 'Linux', 'macOS', 'iOS', 'Android',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
    'SQL Server', 'MySQL', 'PostgreSQL', 'MongoDB',
    'Apache', 'Nginx', 'IIS', 'WordPress', 'Drupal',
    'Java', 'Python', 'Node.js', 'PHP', '.NET',
    'Active Directory', 'Exchange', 'SharePoint', 'Office 365',
    'VMware', 'Citrix', 'Fortinet', 'Cisco'
  ];

  techKeywords.forEach(tech => {
    if (description.toLowerCase().includes(tech.toLowerCase())) {
      technologies.push(tech);
    }
  });

  return [...new Set(technologies)].slice(0, 5); // Supprime les doublons et limite à 5
};

/**
 * Extrait les pays mentionnés
 */
const extractCountries = (description) => {
  const countries = [];
  const countryKeywords = {
    'France': ['france', 'french', 'paris', 'français'],
    'United States': ['united states', 'usa', 'us', 'america', 'american'],
    'United Kingdom': ['united kingdom', 'uk', 'britain', 'london', 'british'],
    'Germany': ['germany', 'german', 'berlin'],
    'Canada': ['canada', 'canadian'],
    'Australia': ['australia', 'australian'],
    'Japan': ['japan', 'japanese', 'tokyo'],
    'China': ['china', 'chinese', 'beijing'],
    'Russia': ['russia', 'russian', 'moscow']
  };

  Object.entries(countryKeywords).forEach(([country, keywords]) => {
    if (keywords.some(keyword => description.toLowerCase().includes(keyword))) {
      countries.push(country);
    }
  });

  return countries.length > 0 ? countries : ['Monde entier'];
};

/**
 * Extrait les vulnérabilités (CVE)
 */
const extractVulnerabilities = (description) => {
  const vulnerabilities = [];
  const cveRegex = /CVE-\d{4}-\d+/gi;
  const cves = description.match(cveRegex);
  
  if (cves) {
    vulnerabilities.push(...[...new Set(cves)].slice(0, 3)); // Supprime les doublons
  }

  // Ajoute des vulnérabilités génériques si aucun CVE n'est trouvé
  if (vulnerabilities.length === 0) {
    if (description.toLowerCase().includes('sql injection')) {
      vulnerabilities.push('Injection SQL');
    }
    if (description.toLowerCase().includes('xss')) {
      vulnerabilities.push('Cross-Site Scripting (XSS)');
    }
    if (description.toLowerCase().includes('rce') || description.toLowerCase().includes('remote code execution')) {
      vulnerabilities.push('Remote Code Execution');
    }
    if (description.toLowerCase().includes('buffer overflow')) {
      vulnerabilities.push('Buffer Overflow');
    }
  }

  return vulnerabilities.length > 0 ? vulnerabilities : ['Vulnérabilité non spécifiée'];
};

/**
 * Normalise un titre pour la comparaison (dédoublonnage)
 */
const normalizeTitle = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Supprime la ponctuation
    .replace(/\s+/g, ' ') // Normalise les espaces
    .trim()
    .substring(0, 100); // Limite la longueur
};

/**
 * Calcule la similarité entre deux titres (simplifié)
 */
const calculateSimilarity = (title1, title2) => {
  const normalized1 = normalizeTitle(title1);
  const normalized2 = normalizeTitle(title2);
  
  // Si les titres normalisés sont identiques, c'est un doublon
  if (normalized1 === normalized2) {
    return 1.0;
  }
  
  // Vérifie si un titre contient l'autre (à 80% de similarité)
  const words1 = normalized1.split(' ');
  const words2 = normalized2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word) && word.length > 3);
  const similarity = (commonWords.length * 2) / (words1.length + words2.length);
  
  return similarity;
};

/**
 * Dédoublonne les incidents basé sur la similarité des titres
 */
export const deduplicateIncidents = (incidents) => {
  const uniqueIncidents = [];
  const seenTitles = new Set();

  for (const incident of incidents) {
    const normalizedTitle = normalizeTitle(incident.title);
    let isDuplicate = false;

    // Vérifie si c'est un doublon exact
    if (seenTitles.has(normalizedTitle)) {
      isDuplicate = true;
    } else {
      // Vérifie la similarité avec les incidents déjà ajoutés
      for (const existing of uniqueIncidents) {
        const similarity = calculateSimilarity(incident.title, existing.title);
        if (similarity > 0.8) { // Seuil de similarité à 80%
          isDuplicate = true;
          // Garde l'incident le plus récent
          if (incident.date > existing.date) {
            const index = uniqueIncidents.indexOf(existing);
            uniqueIncidents[index] = incident;
          }
          break;
        }
      }
    }

    if (!isDuplicate) {
      uniqueIncidents.push(incident);
      seenTitles.add(normalizedTitle);
    }
  }

  return uniqueIncidents;
};

/**
 * Convertit un article RSS en objet Incident avec nettoyage spécifique par source
 */
export const convertRSSItemToIncident = (item, sourceName, index) => {
  const description = item.description || item.content || item.contentSnippet || '';
  const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
  
  // Nettoyage spécifique selon la source
  let cleanDescription = cleanHTML(description);
  
  // Nettoyage spécifique pour CERT-FR (ANSSI)
  if (sourceName === 'CERT-FR') {
    // CERT-FR peut avoir un format spécifique
    cleanDescription = cleanDescription.replace(/CERT-FR[^\n]*/gi, '').trim();
  }
  
  // Nettoyage spécifique pour Bleeping Computer
  if (sourceName === 'Bleeping Computer') {
    // Supprime les balises de catégorie souvent présentes
    cleanDescription = cleanDescription.replace(/\[.*?\]/g, '').trim();
  }

  const baseThreatLevel = determineBaseThreatLevel(item.title || '', cleanDescription);
  const threatLevel = applyAutoScoring(item.title || '', cleanDescription, baseThreatLevel);
  const category = categorizeIncident(item.title || '', cleanDescription);

  return {
    id: `${sourceName.toLowerCase().replace(/\s+/g, '-')}-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: item.title || 'Incident de cybersécurité',
    source: sourceName,
    sourceUrl: item.link || item.guid || null,
    date: pubDate,
    summary: cleanDescription.substring(0, 200) + (cleanDescription.length > 200 ? '...' : ''),
    detailedSummary: cleanDescription,
    threatLevel,
    category,
    technologies: extractTechnologies(cleanDescription),
    affectedCountries: extractCountries(cleanDescription),
    vulnerabilities: extractVulnerabilities(cleanDescription)
  };
};
