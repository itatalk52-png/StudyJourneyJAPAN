importScripts("./offline-assets.js");

const CACHE="study-journey-v2-1-0-official-release";
const CORE_ASSETS=[
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./mission-data.js",
  "./mission.js",
  "./manifest.webmanifest",
  "./offline-assets.js"
];
const OFFLINE_ASSETS=[...new Set([...(self.SJJ_OFFLINE_ASSETS||[]),...CORE_ASSETS])];

async function cacheStaticAssets(){
  const cache=await caches.open(CACHE);
  await cache.addAll(CORE_ASSETS);
  const extras=OFFLINE_ASSETS.filter(path=>!CORE_ASSETS.includes(path));
  const batchSize=8;
  for(let i=0;i<extras.length;i+=batchSize){
    const batch=extras.slice(i,i+batchSize);
    await Promise.allSettled(batch.map(async path=>{
      const request=new Request(path,{cache:"reload"});
      const response=await fetch(request);
      if(response&&response.ok)await cache.put(request,response);
    }));
  }
}

self.addEventListener("install",event=>{
  event.waitUntil(cacheStaticAssets().then(()=>self.skipWaiting()));
});

self.addEventListener("message",event=>{
  if(event.data&&event.data.type==="SKIP_WAITING"){
    self.skipWaiting();
  }
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys=>Promise.all(
        keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))
      )),
      self.clients.claim()
    ])
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;

  const url=new URL(event.request.url);
  const sameOrigin=url.origin===self.location.origin;
  const isNavigation=event.request.mode==="navigate";
  const isCore=sameOrigin&&(
    url.pathname.endsWith("app.js")||
    url.pathname.endsWith("style.css")||
    url.pathname.endsWith("index.html")||
    url.pathname.endsWith("mission-data.js")||
    url.pathname.endsWith("mission.js")||
    url.pathname.endsWith("offline-assets.js")||
    url.pathname.endsWith("/")||
    url.pathname.endsWith("manifest.webmanifest")
  );

  if(isNavigation){
    event.respondWith(
      fetch(event.request,{cache:"no-store"})
        .then(response=>{
          if(response&&response.ok){
            const copy=response.clone();
            caches.open(CACHE).then(cache=>cache.put("./index.html",copy));
          }
          return response;
        })
        .catch(async()=>(
          await caches.match(event.request)||
          await caches.match("./index.html")||
          await caches.match("./")
        ))
    );
    return;
  }

  if(isCore){
    event.respondWith(
      fetch(event.request,{cache:"no-store"})
        .then(response=>{
          if(response&&response.ok){
            const copy=response.clone();
            caches.open(CACHE).then(cache=>cache.put(event.request,copy));
          }
          return response;
        })
        .catch(()=>caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>{
      if(cached)return cached;
      return fetch(event.request).then(response=>{
        if(response&&response.ok&&sameOrigin){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        }
        return response;
      });
    })
  );
});
