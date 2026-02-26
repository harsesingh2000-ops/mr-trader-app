const CACHE='mr-trader-v5';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(CORE.map(u=>c.add(u)))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(cached=>{
    const net=fetch(e.request).then(resp=>{
      if(resp&&resp.ok&&resp.type!=='opaque'){caches.open(CACHE).then(c=>c.put(e.request,resp.clone()));}
      return resp;
    }).catch(()=>null);
    return cached||(net.catch(()=>caches.match('./index.html')));
  }));
});
