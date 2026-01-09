// Enum pour les catégories d'incidents
export const IncidentCategory = {
  RANSOMWARE: 'Ransomware',
  DATA_BREACH: 'Fuite de données',
  PHISHING: 'Phishing'
};

// Enum pour les niveaux de menace
export const ThreatLevel = {
  LOW: 'Faible',
  MEDIUM: 'Moyen',
  HIGH: 'Élevé',
  CRITICAL: 'Critique'
};

// Fonction pour générer une date aléatoire dans les derniers jours
export const generateRandomDate = (maxDaysAgo = 30) => {
  const now = Date.now();
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const millisecondsAgo = (daysAgo * 24 * 60 * 60 * 1000) + 
                           (hoursAgo * 60 * 60 * 1000) + 
                           (minutesAgo * 60 * 1000);
  
  return new Date(now - millisecondsAgo);
};

// Sources réelles de cybersécurité (URLs optionnelles)
const realSources = {
  'Cybersécurité France': 'https://www.ssi.gouv.fr/',
  'Tech Security News': 'https://www.bleepingcomputer.com/',
  'Cyber Alert': 'https://www.cisa.gov/news-events/cybersecurity-advisories',
  'Security Research Lab': 'https://www.kaspersky.com/resource-center/threats',
  'Financial Security Watch': 'https://www.sec.gov/',
  'Mobile Security': 'https://www.mcafee.com/blogs/',
  'National Cyber Defense': 'https://www.cyber.gc.ca/',
  'API Security Blog': 'https://owasp.org/www-project-api-security/'
};

// Fonction pour obtenir l'URL de la source ou null
const getSourceUrl = (source) => {
  return realSources[source] || null;
};

// Données d'exemple des incidents avec dates dynamiques
export const sampleIncidents = [
  {
    id: '1',
    title: 'Attaque Ransomware majeure contre un hôpital',
    source: 'Cybersécurité France',
    sourceUrl: getSourceUrl('Cybersécurité France'),
    date: generateRandomDate(7),
    summary: 'Un hôpital parisien a été victime d\'une attaque ransomware qui a paralysé ses systèmes pendant 48 heures. Les données des patients ont été chiffrées.',
    detailedSummary: 'L\'hôpital Georges-Pompidou à Paris a été la cible d\'une attaque ransomware sophistiquée le 15 janvier 2024. Les attaquants ont réussi à infiltrer le réseau hospitalier via une faille dans le système de gestion des dossiers patients. Tous les serveurs ont été chiffrés avec le ransomware LockBit 3.0, paralysant complètement les opérations pendant 48 heures. Les services d\'urgence ont dû être redirigés vers d\'autres établissements. Les données de plus de 15 000 patients ont été chiffrées, et les attaquants demandent une rançon de 2 millions d\'euros. Les autorités françaises et l\'ANSSI (Agence Nationale de la Sécurité des Systèmes d\'Information) sont intervenues pour assister l\'hôpital dans la récupération des systèmes.',
    threatLevel: ThreatLevel.CRITICAL,
    category: IncidentCategory.RANSOMWARE,
    technologies: ['Windows Server 2019', 'Système de gestion hospitalière (Dossier Patient Électronique)', 'Active Directory', 'SQL Server'],
    affectedCountries: ['France'],
    vulnerabilities: ['CVE-2023-34362 (Microsoft Exchange)', 'Accès non sécurisé RDP', 'Absence de segmentation réseau']
  },
  {
    id: '2',
    title: 'Fuite de données chez un fournisseur cloud',
    source: 'Tech Security News',
    sourceUrl: getSourceUrl('Tech Security News'),
    date: generateRandomDate(14),
    summary: 'Plus de 2 millions de comptes utilisateurs ont été exposés suite à une faille de sécurité dans l\'infrastructure cloud d\'un fournisseur majeur.',
    detailedSummary: 'CloudTech Solutions, un fournisseur cloud majeur basé aux États-Unis, a annoncé une violation de données massive affectant 2,3 millions de comptes utilisateurs. L\'incident a été découvert le 10 janvier 2024 lors d\'un audit de sécurité de routine. Les attaquants ont exploité une faille de configuration dans un bucket S3 non sécurisé, exposant des données personnelles incluant noms, adresses email, numéros de téléphone et mots de passe hashés. La faille était présente depuis novembre 2023, permettant aux attaquants d\'accéder aux données pendant près de 2 mois. Les données ont été partiellement publiées sur un forum dark web. CloudTech Solutions a notifié tous les utilisateurs affectés et a mis en place des mesures de sécurité renforcées.',
    threatLevel: ThreatLevel.HIGH,
    category: IncidentCategory.DATA_BREACH,
    technologies: ['Amazon S3', 'AWS Lambda', 'Docker', 'Kubernetes', 'PostgreSQL'],
    affectedCountries: ['États-Unis', 'Canada', 'Royaume-Uni', 'Allemagne', 'France'],
    vulnerabilities: ['Bucket S3 public non intentionnel', 'Absence de chiffrement au repos', 'IAM mal configuré']
  },
  {
    id: '3',
    title: 'Campagne de phishing ciblant les entreprises',
    source: 'Cyber Alert',
    sourceUrl: getSourceUrl('Cyber Alert'),
    date: generateRandomDate(10),
    summary: 'Une nouvelle campagne de phishing sophistiquée cible les employés des grandes entreprises avec des emails imitant les services RH.',
    detailedSummary: 'Une campagne de phishing sophistiquée, baptisée "HR-Phish 2024", cible actuellement les employés des grandes entreprises européennes. Les attaquants envoient des emails soigneusement conçus imitant les services des ressources humaines, demandant aux employés de mettre à jour leurs informations de compte via un lien frauduleux. Les emails utilisent des techniques d\'ingénierie sociale avancées, incluant le spoofing de domaines légitimes et des informations personnalisées volées lors de précédentes violations. Plus de 500 entreprises ont été ciblées, avec un taux de succès estimé à 12%. Les attaquants volent les identifiants Office 365 et accèdent aux systèmes internes pour exfiltrer des données sensibles. Les secteurs les plus touchés sont la finance, la santé et la technologie.',
    threatLevel: ThreatLevel.MEDIUM,
    category: IncidentCategory.PHISHING,
    technologies: ['Office 365', 'Microsoft Azure AD', 'Exchange Online', 'SharePoint'],
    affectedCountries: ['France', 'Allemagne', 'Royaume-Uni', 'Espagne', 'Italie', 'Belgique'],
    vulnerabilities: ['Absence de DMARC/SPF/DKIM', 'Formation insuffisante des employés', 'Multi-Factor Authentication non activé']
  },
  {
    id: '4',
    title: 'Nouveau variant de ransomware détecté',
    source: 'Security Research Lab',
    sourceUrl: getSourceUrl('Security Research Lab'),
    date: generateRandomDate(21),
    summary: 'Les chercheurs ont identifié un nouveau variant de ransomware qui utilise des techniques d\'évasion avancées pour contourner les antivirus.',
    detailedSummary: 'Les chercheurs en cybersécurité du Security Research Lab ont identifié un nouveau variant de ransomware, nommé "CryptoLocker-X", qui présente des capacités d\'évasion particulièrement avancées. Ce malware utilise des techniques de polymorphisme pour modifier son code à chaque exécution, rendant la détection par signature extrêmement difficile. Il exploite également des vulnérabilités zero-day dans les systèmes Windows et utilise le chiffrement hybride RSA-AES pour verrouiller les fichiers. Le ransomware cible spécifiquement les fichiers critiques des entreprises : bases de données, sauvegardes, et fichiers de configuration. Il se propage via des attaques RDP brute-force et des emails de phishing. Plus de 200 organisations ont été affectées en moins d\'un mois, principalement des PME avec des budgets de sécurité limités.',
    threatLevel: ThreatLevel.HIGH,
    category: IncidentCategory.RANSOMWARE,
    technologies: ['Windows 10/11', 'Windows Server', 'Active Directory', 'SQL Server', 'VMware vSphere'],
    affectedCountries: ['Monde entier', 'Concentration en Europe et Amérique du Nord'],
    vulnerabilities: ['CVE-2023-38831 (Windows Shell)', 'RDP exposé sur Internet', 'Absence de correctifs de sécurité']
  },
  {
    id: '5',
    title: 'Violation de données dans le secteur bancaire',
    source: 'Financial Security Watch',
    sourceUrl: getSourceUrl('Financial Security Watch'),
    date: generateRandomDate(5),
    summary: 'Une banque régionale a signalé une violation de données affectant les informations personnelles de 50 000 clients.',
    detailedSummary: 'La Banque Régionale du Sud-Ouest (BRSO) a annoncé une violation de données majeure affectant 50 000 clients. L\'attaque a été découverte le 8 janvier 2024 lors d\'une analyse de trafic réseau anormal. Les attaquants ont réussi à s\'infiltrer dans le système bancaire via une application web vulnérable utilisée pour les services en ligne. Ils ont exploité une injection SQL pour accéder à la base de données contenant les informations personnelles des clients : noms, adresses, numéros de compte, soldes, et historiques de transactions. Les données ont été exfiltrées sur une période de 3 semaines avant la détection. La banque a immédiatement fermé l\'application vulnérable et a notifié l\'ACPR (Autorité de Contrôle Prudentiel et de Résolution) ainsi que tous les clients affectés. Des mesures de surveillance renforcée des comptes ont été mises en place.',
    threatLevel: ThreatLevel.CRITICAL,
    category: IncidentCategory.DATA_BREACH,
    technologies: ['Oracle Database', 'Java Spring Framework', 'Apache Tomcat', 'IBM Mainframe'],
    affectedCountries: ['France'],
    vulnerabilities: ['Injection SQL (CVE-2023-34395)', 'Authentification faible', 'Absence de WAF']
  },
  {
    id: '6',
    title: 'Escroquerie par phishing via SMS',
    source: 'Mobile Security',
    sourceUrl: getSourceUrl('Mobile Security'),
    date: generateRandomDate(3),
    summary: 'Une vague de SMS frauduleux prétendant provenir de services gouvernementaux a été signalée dans plusieurs régions.',
    detailedSummary: 'Une campagne de smishing (SMS phishing) massive cible actuellement les citoyens français avec des messages prétendant provenir de services gouvernementaux comme la CAF, Pôle Emploi, ou les impôts. Les messages contiennent des liens vers des sites web frauduleux conçus pour ressembler aux sites officiels. Les victimes sont invitées à saisir leurs identifiants et informations bancaires pour "régulariser leur situation" ou "recevoir un remboursement". Plus de 10 000 SMS frauduleux ont été envoyés en une semaine, avec un taux de réponse estimé à 5%. Les sites frauduleux utilisent des certificats SSL légitimes pour paraître authentiques. Les autorités ont lancé une campagne de sensibilisation et travaillent avec les opérateurs téléphoniques pour bloquer les numéros suspects.',
    threatLevel: ThreatLevel.LOW,
    category: IncidentCategory.PHISHING,
    technologies: ['SMS Gateway', 'Sites web frauduleux (HTML/CSS/JavaScript)', 'Certificats SSL'],
    affectedCountries: ['France'],
    vulnerabilities: ['Manque de sensibilisation des utilisateurs', 'Absence de vérification d\'identité', 'Numéros spoofés']
  },
  {
    id: '7',
    title: 'Attaque ciblée contre infrastructure critique',
    source: 'National Cyber Defense',
    sourceUrl: getSourceUrl('National Cyber Defense'),
    date: generateRandomDate(2),
    summary: 'Une tentative d\'attaque contre une infrastructure critique a été détectée et neutralisée. L\'enquête est en cours.',
    detailedSummary: 'Les services de cybersécurité nationaux ont détecté et neutralisé une tentative d\'attaque sophistiquée contre une infrastructure critique du secteur de l\'énergie. L\'attaque, attribuée à un groupe APT (Advanced Persistent Threat) d\'origine étrangère, visait à prendre le contrôle des systèmes SCADA (Supervisory Control and Data Acquisition) d\'une centrale électrique. Les attaquants ont utilisé une chaîne d\'attaque multi-étapes : phishing initial pour obtenir des identifiants, mouvement latéral dans le réseau, et tentative d\'accès aux systèmes industriels. L\'attaque a été détectée grâce à un système de détection d\'anomalies avancé qui a identifié un trafic réseau suspect. Les équipes de sécurité ont immédiatement isolé les systèmes affectés et ont empêché l\'accès aux systèmes critiques. Une enquête approfondie est en cours pour identifier l\'origine exacte de l\'attaque et renforcer les défenses.',
    threatLevel: ThreatLevel.CRITICAL,
    category: IncidentCategory.RANSOMWARE,
    technologies: ['Systèmes SCADA/ICS', 'Windows Server', 'Siemens SIMATIC', 'Modbus TCP/IP', 'OPC Classic'],
    affectedCountries: ['France'],
    vulnerabilities: ['Systèmes OT non isolés du réseau IT', 'Authentification faible sur systèmes industriels', 'Absence de monitoring réseau']
  },
  {
    id: '8',
    title: 'Exposition de données API non sécurisée',
    source: 'API Security Blog',
    sourceUrl: getSourceUrl('API Security Blog'),
    date: generateRandomDate(12),
    summary: 'Une API mal configurée a exposé des données sensibles de plusieurs milliers d\'utilisateurs pendant plusieurs semaines.',
    detailedSummary: 'Une startup technologique a découvert qu\'une API REST non sécurisée exposait des données personnelles de 8 500 utilisateurs depuis plus de 6 semaines. L\'API, utilisée pour une application mobile, était accessible publiquement sans authentification ni limitation de taux. Un chercheur en sécurité a découvert l\'exposition lors d\'un scan de sécurité de routine et a notifié l\'entreprise de manière responsable. Les données exposées incluaient : noms, emails, numéros de téléphone, adresses, et préférences utilisateurs. Bien qu\'aucune donnée financière n\'ait été exposée, l\'incident représente un risque significatif pour la vie privée. L\'entreprise a immédiatement sécurisé l\'API en ajoutant l\'authentification OAuth 2.0, la limitation de taux, et le chiffrement des données sensibles. Tous les utilisateurs affectés ont été notifiés et des mesures de surveillance renforcée ont été mises en place.',
    threatLevel: ThreatLevel.MEDIUM,
    category: IncidentCategory.DATA_BREACH,
    technologies: ['REST API (Node.js/Express)', 'MongoDB', 'AWS API Gateway', 'React Native'],
    affectedCountries: ['France', 'Belgique', 'Suisse'],
    vulnerabilities: ['API publique sans authentification', 'Absence de rate limiting', 'Données non chiffrées']
  }
];

// Fonction pour formater la date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

// Fonction pour obtenir la couleur du niveau de menace
export const getThreatLevelColor = (level) => {
  switch (level) {
    case ThreatLevel.LOW:
      return 'bg-green-500/70';
    case ThreatLevel.MEDIUM:
      return 'bg-yellow-500/70';
    case ThreatLevel.HIGH:
      return 'bg-orange-500/70';
    case ThreatLevel.CRITICAL:
      return 'bg-red-500/70';
    default:
      return 'bg-gray-500/70';
  }
};
