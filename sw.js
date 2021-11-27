const CACHE_NAME_CORE='CACHE-V1';
const CACHE_FILES_CORE=[
    "src/css/app.css",
    "src/js/app.js",
    "src/images/icons/icon-144x144.png",
    "src/images/user.jpg",
    "src/images/favicon.png",
    "src/images/android-desktop.png",
    "src/images/ios-desktop.png",
    "index.html",
    "/"
];
const CACHE_NAME_DYNAMIC='dynamic-v1';

const CACHE_NAME_INMUTABLE='inmutable-v1';
const CACHE_FILES_INMUTABLE=[
    "https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://code.getmdl.io/1.3.0/material.cyan-light_blue.min.css",
    "http://www.example.com/",
    "http://www.w3.org/2000/svg",
    "http://www.w3.org/1999/xlink",
    "https://github.com/google/material-design-lite/blob/mdl-1.x/templates/dashboard/",
    "https://unpkg.com/pwacompat"
];

self.addEventListener('install', (event)=>{
    const guardandoCache=caches.open(CACHE_NAME_CORE)
        .then (cache =>cache.addAll(CACHE_FILES_CORE))
        .catch(err=>console.error(err.message));
    const guardandoCacheInmutable=caches.open(CACHE_NAME_INMUTABLE)
        .then (cache =>cache.addAll(CACHE_FILES_INMUTABLE))
        .catch(err=>console.error(err.message));   
    self.skipWaiting();
    event.waitUntil(Promise.all([guardandoCache,guardandoCacheInmutable]));
    });

self.addEventListener('activate', async (event) =>{
    console.log('sw: Activo y listo para controlar');
    const obtenerCaches = caches.keys()
    .then(allCaches => allCaches.filter(cache => ![CACHE_NAME_CORE, CACHE_NAME_INMUTABLE, CACHE_NAME_DYNAMIC].includes(cache)).filter(cacheName => caches.delete(cacheName))) 
    .catch(err => console.error(err.message))
  console.info('[SW]: Cache limpiado exitosamente...');
  event.waitUntil(obtenerCaches);
});

self.addEventListener('fetch',  (event)=>{
    if(!(event.request.url.indexOf('http') === 0)){
        return;
      }

      const cacheAyudaRed = caches.match(event.request)
        .then(page => page || fetch(event.request)
        .then(eventRequest => {
          return caches.open(CACHE_NAME_DYNAMIC).then(cache => {
            if (![].concat(CACHE_FILES_CORE,CACHE_FILES_INMUTABLE).indexOf(event.request.url) || eventRequest.type === 'opaque') {
              cache.put(event.request, eventRequest.clone())
              }
              return eventRequest;
              })
            }));
      event.respondWith(cacheAyudaRed);    
});

self.addEventListener('sync',  (event)=>{
    console.log(event);
});

self.addEventListener('push',  (event)=>{
    console.error(event);
});

