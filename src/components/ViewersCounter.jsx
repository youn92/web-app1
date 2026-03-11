import React, { useState, useEffect, useRef } from 'react';

const SESSION_ID = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const ViewersCounter = () => {
  const [viewers, setViewers] = useState(1);
  const heartbeatRef = useRef(null);
  const pollRef = useRef(null);

  const getRedis = () => ({
    url: import.meta.env.VITE_UPSTASH_URL,
    token: import.meta.env.VITE_UPSTASH_TOKEN,
  });

  const redisCmd = async (path) => {
    const { url, token } = getRedis();
    const res = await fetch(`${url}/${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  const registerPresence = async () => {
    const { url, token } = getRedis();
    const expireAt = Date.now() + 60000;
    await fetch(`${url}/zadd/cybnews:viewers/${expireAt}/${SESSION_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const fetchViewers = async () => {
    const { url, token } = getRedis();
    // Purge sessions expirées
    await fetch(`${url}/zremrangebyscore/cybnews:viewers/-inf/${Date.now() - 1}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Compte les présents
    const res = await redisCmd('zcard/cybnews:viewers');
    return Math.max(1, res?.result ?? 1);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await registerPresence();
        setViewers(await fetchViewers());
      } catch (err) {
        console.error('Erreur présence:', err);
      }
    };
    init();

    heartbeatRef.current = setInterval(async () => {
      try { await registerPresence(); } catch (_) {}
    }, 25000);

    pollRef.current = setInterval(async () => {
      try { setViewers(await fetchViewers()); } catch (_) {}
    }, 15000);

    const onUnload = () => {
      const { url, token } = getRedis();
      navigator.sendBeacon?.(
        `${url}/zrem/cybnews:viewers/${SESSION_ID}`,
        new Blob([''], { type: 'text/plain' })
      );
    };

    const onVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        try {
          await registerPresence();
          setViewers(await fetchViewers());
        } catch (_) {}
      }
    };

    window.addEventListener('beforeunload', onUnload);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(heartbeatRef.current);
      clearInterval(pollRef.current);
      window.removeEventListener('beforeunload', onUnload);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        {viewers} en direct
      </span>
    </div>
  );
};

export default ViewersCounter;