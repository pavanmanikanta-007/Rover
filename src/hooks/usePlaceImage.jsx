import { useState, useEffect } from 'react';

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const FALLBACK = '/OIP.jpg'; // your existing fallback image

const cache = {}; // prevents duplicate API calls for same query

const usePlaceImage = (query) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!query) return;

    // Return cached result instantly
    if (cache[query]) {
      setImageUrl(cache[query]);
      return;
    }

    const fetchImage = async () => {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`
        );
        const data = await res.json();
        const url = data.results?.[0]?.urls?.regular || FALLBACK;
        cache[query] = url;
        setImageUrl(url);
      } catch (err) {
        setImageUrl(FALLBACK);
      }
    };

    fetchImage();
  }, [query]);

  return imageUrl || FALLBACK;
};

export default usePlaceImage;