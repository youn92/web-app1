import React, { useState, useEffect } from 'react';

const ViewersCounter = () => {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    const redisUrl = import.meta.env.VITE_UPSTASH_URL;
    const redisToken = import.meta.env.VITE_UPSTASH_TOKEN;

    const handleConnection = async () => {
      try {
        // 1. Incrémenter le compteur global dans Redis
        await fetch(`${redisUrl}/incr/cybnews_total_visits`, {
          headers: { Authorization: `Bearer ${redisToken}` }
        });

        // 2. Récupérer la valeur actuelle pour l'affichage
        const response = await fetch(`${redisUrl}/get/cybnews_total_visits`, {
          headers: { Authorization: `Bearer ${redisToken}` }
        });
        const data = await response.json();
        
        // On affiche la valeur ou 1 par défaut
        setViewers(data.result ? parseInt(data.result) : 1);
      } catch (error) {
        console.error("Erreur base de données:", error);
        setViewers(1); // Fallback si la DB est hors ligne
      }
    };

    handleConnection();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {viewers} Visiteurs cumulés
      </span>
    </div>
  );
};

export default ViewersCounter;