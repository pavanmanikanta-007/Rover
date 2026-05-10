const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

// ─── In-memory cache ──────────────────────────────────────────────────────────
const cache = {};

// ─── API Fetchers ─────────────────────────────────────────────────────────────

const fetchUnsplash = async (query) => {
  if (!query || !UNSPLASH_KEY) return null;
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || null;
  } catch (_) { return null; }
};

const fetchPexels = async (query) => {
  if (!query || !PEXELS_KEY) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: PEXELS_KEY } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.photos?.[0]?.src?.large2x || null;
  } catch (_) { return null; }
};

const fetchWikimedia = async (query) => {
  if (!query) return null;
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail?.source || null;
  } catch (_) { return null; }
};

// ─── Core waterfall ───────────────────────────────────────────────────────────
const fetchWithFallback = async (attempts) => {
  for (const [apiFn, query] of attempts) {
    if (!query) continue;
    const url = await apiFn(query);
    if (url) return url;
  }
  // Absolute last resort — guaranteed to return SOMETHING
  // Uses Unsplash's most generic travel query which always has results
  return (
    (await fetchUnsplash('travel nature scenic')) ||
    (await fetchPexels('travel scenic')) ||
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800' // hardcoded only if ALL apis fail
  );
};

// ─── Landmark detector ────────────────────────────────────────────────────────
// Only attempt Wikimedia if the name looks like an actual famous landmark.
// Whitelist approach — must contain a landmark keyword to qualify.
const looksLikeLandmark = (name = '') => {
  const l = name.toLowerCase();
  return ['falls','fort','castle','palace','temple','cathedral','mosque',
          'shrine','monument','national park','historic site','heritage',
          'tower','bridge','dam','cave','volcano','glacier','canyon',
          'pyramid','ruins','basilica','citadel','colosseum',
          'statue','memorial','capitol','lighthouse'].some(w => l.includes(w));
};

// ─── Place type detector ──────────────────────────────────────────────────────
const detectPlaceType = (placeName = '') => {
  const l = placeName.toLowerCase();
  if (['restaurant','dinner','cafe','lunch','sushi','bar','bistro','grill','tapas','dine','food','eat'].some(w => l.includes(w)))
    return 'restaurant food dining';
  if (['beach','coast','shore','bay','island'].some(w => l.includes(w)))
    return 'beach ocean waves';
  if (['museum','gallery','art','history','exhibit','monument'].some(w => l.includes(w)))
    return 'museum architecture';
  if (['park','garden','nature','forest','trail','hike','wildlife'].some(w => l.includes(w)))
    return 'nature park greenery';
  if (['spa','wellness','relax','massage'].some(w => l.includes(w)))
    return 'luxury spa wellness';
  if (['mall','shopping','market','shop','store','boutique'].some(w => l.includes(w)))
    return 'shopping mall retail';
  if (['hotel','inn','check-in','checkin','stay','resort','lodge'].some(w => l.includes(w)))
    return 'hotel luxury stay';
  if (['airport','depart','arrival','fly','flight'].some(w => l.includes(w)))
    return 'airport travel';
  if (['drive','road','journey','scenic','parkway','highway'].some(w => l.includes(w)))
    return 'scenic road trip';
  if (['lake','river','waterfall','valley','canyon','cliff'].some(w => l.includes(w)))
    return 'scenic landscape water';
  if (['temple','church','mosque','shrine','cathedral'].some(w => l.includes(w)))
    return 'temple religious architecture';
  if (['brewery','beer','winery','wine','tasting'].some(w => l.includes(w)))
    return 'brewery craft beer';
  if (['aquarium','zoo','safari'].some(w => l.includes(w)))
    return 'aquarium marine life';
  return 'travel destination scenic';
};

// ─── DESTINATION IMAGE (InfoSection hero) ────────────────────────────────────
export const GetDestinationImage = async (location) => {
  if (!location) return await fetchUnsplash('beautiful travel destination');

  const key = `destination:${location}`;
  if (cache[key]) return cache[key];

  const url = await fetchWithFallback([
    [fetchUnsplash,  `${location} landscape travel scenic`],
    [fetchUnsplash,  `${location} tourism`],
    [fetchWikimedia,  location],
    [fetchPexels,    `${location} travel`],
    [fetchUnsplash,  `${location}`],
    [fetchPexels,    `${location} cityscape`],
    [fetchUnsplash,  'beautiful travel destination landscape'],
  ]);

  cache[key] = url;
  return url;
};

// ─── HOTEL IMAGE ──────────────────────────────────────────────────────────────
export const GetHotelImage = async (hotelName, location) => {
  if (!hotelName) return await fetchPexels('luxury hotel interior');

  const key = `hotel:${hotelName}`;
  if (cache[key]) return cache[key];

  const url = await fetchWithFallback([
    [fetchPexels,    `${hotelName} hotel`],
    [fetchWikimedia,  hotelName],
    [fetchPexels,    `${location} luxury hotel`],
    [fetchUnsplash,  `${hotelName} ${location}`],
    [fetchUnsplash,  `${location} hotel`],
    [fetchPexels,    'luxury hotel interior room'],
    [fetchUnsplash,  'luxury hotel interior'],
  ]);

  cache[key] = url;
  return url;
};

// ─── PLACE IMAGE ──────────────────────────────────────────────────────────────
export const GetPlaceImage = async (placeName, location) => {
  if (!placeName) return await fetchPexels('travel destination scenic');

  const key = `place:${placeName}`;
  if (cache[key]) return cache[key];

  const type = detectPlaceType(placeName);

  const url = await fetchWithFallback([
    // Only try Wikimedia if it looks like a real landmark — avoids 404 noise
    ...(looksLikeLandmark(placeName) ? [[fetchWikimedia, placeName]] : []),
    [fetchPexels,   `${placeName} ${location}`],
    [fetchUnsplash, `${placeName} ${location}`],
    [fetchPexels,   `${location} ${type}`],
    [fetchUnsplash, `${location} ${type}`],
    [fetchPexels,    type],
    [fetchUnsplash,  type],
    [fetchPexels,   `${location} travel`],
    [fetchUnsplash, `${location} travel`],
  ]);

  cache[key] = url;
  return url;
};