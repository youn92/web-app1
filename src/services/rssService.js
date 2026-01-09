import { IncidentCategory, ThreatLevel } from '../data/incidents';

// URL du flux RSS de The Hacker News
const HACKER_NEWS_RSS_URL = 'https://feeds.feedburner.com/TheHackersNews';

// Service RSS-to-JSON (utilise rss2json.com)
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

/**
 * Récupère et parse le flux RSS de The Hacker News
 */
export const fetchHackerNewsRSS = async () => {
  try {
    // Utilise rss2json.com pour convertir le RSS en JSON
    // Note: Ce service peut avoir des limitations de taux. Pour la production,
    // considérez utiliser votre propre proxy backend ou une API dédiée.
    const response = await fetch(
      `${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(HACKER_NEWS_RSS_URL)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(data.message || 'Erreur lors de la récupération du flux RSS');
    }

    if (!data.items || data.items.length === 0) {
      throw new Error('Aucun article trouvé dans le flux RSS');
    }

    return data.items;
  } catch (error) {
    console.error('Erreur lors de la récupération du RSS:', error);
    // Re-lance l'erreur avec un message plus clair
    throw new Error(
      error.message || 
      'Impossible de charger les incidents. Vérifiez votre connexion internet.'
    );
  }
};

/**
 * Détermine la catégorie d'un incident basé sur son titre et contenu
 */
const categorizeIncident = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('ransomware') || text.includes('lockbit') || text.includes('wanna cry')) {
    return IncidentCategory.RANSOMWARE;
  }
  if (text.includes('data breach') || text.includes('data leak') || text.includes('exposed') || text.includes('leaked')) {
    return IncidentCategory.DATA_BREACH;
  }
  if (text.includes('phishing') || text.includes('scam') || text.includes('fraud')) {
    return IncidentCategory.PHISHING;
  }
  
  // Par défaut, on classe comme ransomware si on ne peut pas déterminer
  return IncidentCategory.RANSOMWARE;
};

/**
 * Détermine le niveau de menace basé sur le contenu
 */
const determineThreatLevel = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('critical') || text.includes('zero-day') || text.includes('hospital') || text.includes('infrastructure')) {
    return ThreatLevel.CRITICAL;
  }
  if (text.includes('high') || text.includes('major') || text.includes('millions')) {
    return ThreatLevel.HIGH;
  }
  if (text.includes('medium') || text.includes('moderate')) {
    return ThreatLevel.MEDIUM;
  }
  
  return ThreatLevel.MEDIUM; // Par défaut
};

/**
 * Extrait les technologies mentionnées dans le texte
 */
const extractTechnologies = (description) => {
  const technologies = [];
  const techKeywords = [
    'Windows', 'Linux', 'macOS', 'iOS', 'Android',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
    'SQL Server', 'MySQL', 'PostgreSQL', 'MongoDB',
    'Apache', 'Nginx', 'IIS', 'WordPress', 'Drupal',
    'Java', 'Python', 'Node.js', 'PHP', '.NET',
    'Active Directory', 'Exchange', 'SharePoint', 'Office 365'
  ];

  techKeywords.forEach(tech => {
    if (description.toLowerCase().includes(tech.toLowerCase())) {
      technologies.push(tech);
    }
  });

  return technologies.slice(0, 5); // Limite à 5 technologies
};

/**
 * Extrait les pays mentionnés dans le texte
 */
const extractCountries = (description) => {
  const countries = [];
  const countryKeywords = {
    'France': ['france', 'french', 'paris'],
    'United States': ['united states', 'usa', 'us', 'america'],
    'United Kingdom': ['united kingdom', 'uk', 'britain', 'london'],
    'Germany': ['germany', 'german', 'berlin'],
    'Canada': ['canada', 'canadian'],
    'Australia': ['australia', 'australian'],
    'Japan': ['japan', 'japanese', 'tokyo'],
    'China': ['china', 'chinese', 'beijing']
  };

  Object.entries(countryKeywords).forEach(([country, keywords]) => {
    if (keywords.some(keyword => description.toLowerCase().includes(keyword))) {
      countries.push(country);
    }
  });

  return countries.length > 0 ? countries : ['Monde entier'];
};

/**
 * Extrait les vulnérabilités mentionnées (CVE)
 */
const extractVulnerabilities = (description) => {
  const vulnerabilities = [];
  const cveRegex = /CVE-\d{4}-\d+/gi;
  const cves = description.match(cveRegex);
  
  if (cves) {
    vulnerabilities.push(...cves.slice(0, 3)); // Limite à 3 CVE
  }

  // Ajoute des vulnérabilités génériques si aucun CVE n'est trouvé
  if (vulnerabilities.length === 0) {
    if (description.toLowerCase().includes('sql injection')) {
      vulnerabilities.push('Injection SQL');
    }
    if (description.toLowerCase().includes('xss')) {
      vulnerabilities.push('Cross-Site Scripting (XSS)');
    }
    if (description.toLowerCase().includes('rce')) {
      vulnerabilities.push('Remote Code Execution');
    }
  }

  return vulnerabilities.length > 0 ? vulnerabilities : ['Vulnérabilité non spécifiée'];
};

/**
 * Convertit un article RSS en objet Incident
 */
export const convertRSSItemToIncident = (item, index) => {
  const description = item.description || item.content || '';
  const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
  
  // Nettoie le HTML de la description
  const cleanDescription = description
    .replace(/<[^>]*>/g, '') // Supprime les balises HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

  const category = categorizeIncident(item.title, cleanDescription);
  const threatLevel = determineThreatLevel(item.title, cleanDescription);

  return {
    id: `hacker-news-${index}-${Date.now()}`,
    title: item.title || 'Incident de cybersécurité',
    source: 'The Hacker News',
    sourceUrl: item.link || null,
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
