import React, { useState, useEffect, useRef } from 'react';

// ID unique par onglet/session (non persistant entre les rechargements)
const SESSION_ID = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const REDIS_URL = import.meta.env.VITE_UPSTASH_URL;
const REDIS_TOKEN = import.meta.env.VITE_UPSTASH_TOKEN;

const redisCmd = async (...args) => {
  const response = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!response.ok) throw new Error(`Redis error: ${response.status}`);
  return response.json();
};

const PRESENCE_KEY = 'cybnews:viewers';
const SESSION_TTL_MS = 60 * 1000;
const HEARTBEAT_MS   = 25 * 1000;
const POLL_MS        = 15 * 1000;

const registerPresence = () =>
  redisCmd('ZADD', PRESENCE_KEY, Date.now() + SESSION_TTL_MS, SESSION_ID);

const fetchViewers = async () => {
  await redisCmd('ZREMRANGEBYSCORE', PRESENCE_KEY, '-inf', Date.now() - 1);
  const res = await redisCmd('ZCARD', PRESENCE_KEY);
  return Math.max(1, res?.result ?? 1);
};

const removePresence = () =>
  redisCmd('ZREM', PRESENCE_KEY, SESSION_ID).catch(() => {});

const ViewersCounter = () => {
  const [viewers, setViewers] = useState(1);
  const heartbeatRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        await registerPresence();
        setViewers(await fetchViewers());
      } catch (err) {
        console.error('Erreur init présence:', err);
      }
    };
    init();

    heartbeatRef.current = setInterval(async () => {
      try { await registerPresence(); } catch (_) {}
    }, HEARTBEAT_MS);

    pollRef.current = setInterval(async () => {
      try { setViewers(await fetchViewers()); } catch (_) {}
    }, POLL_MS);

    const onVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        try {
          await registerPresence();
          setViewers(await fetchViewers());
        } catch (_) {}
      }
    };

    const onUnload = () => {
      const body = JSON.stringify(['ZREM', PRESENCE_KEY, SESSION_ID]);
      navigator.sendBeacon?.(REDIS_URL, new Blob([body], { type: 'application/json' }));
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('beforeunload', onUnload);

    return () => {
      clearInterval(heartbeatRef.current);
      clearInterval(pollRef.current);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', onUnload);
      removePresence();
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
```

Et vérifie aussi que ton `.env` contient bien ces deux noms de variables (pas les anciens) :
```
VITE_UPSTASH_REDIS_REST_URL="https://intense-hog-67738.upstash.io"
VITE_UPSTASH_REDIS_REST_TOKEN="gQAAAAAAAQiaAAIncDExOWExNjI4NGI3NGM0MWZlYmIyODg4N2E1MDQ2MDMzMXAxNjc3Mzg"