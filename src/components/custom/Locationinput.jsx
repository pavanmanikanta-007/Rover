import { useState, useRef } from "react";

function LocationInput({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const timeoutRef = useRef(null);

  // REMOVE DUPLICATES
  const removeDuplicates = (places) => {
    const seen = new Set();

    return places.filter((place) => {
      const key = `${place.name}-${place.state}-${place.country}`;

      if (seen.has(key)) return false;

      seen.add(key);

      return true;
    });
  };

  // PROCESS + SCORE RESULTS
  const processResults = (data, value) => {

    if (!data?.features) return [];

    const q = value.toLowerCase();

    const processed = data.features
      .map((place) => {

        const p = place.properties;

        let score = 0;

        if (p.country === "India") score += 2;

        if (p.name?.toLowerCase().startsWith(q))
          score += 3;

        if (p.name?.toLowerCase().includes(q))
          score += 1;

        return {
          name: p.name,
          state: p.state || p.county || "",
          country: p.country,
          full: `${p.name}, ${p.state || ""}, ${p.country}`,
          lat: place.geometry.coordinates[1],
          lon: place.geometry.coordinates[0],
          id: `${p.name}-${place.geometry.coordinates[0]}-${place.geometry.coordinates[1]}`,
          score,
        };
      })

      .sort((a, b) => b.score - a.score);

    return removeDuplicates(processed).slice(0, 5);
  };

  // FETCH LOCATIONS
  const fetchPlaces = (value) => {

    setQuery(value);

    setActiveIndex(-1);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {

      if (value.length < 3) {

        setResults([]);

        setShow(false);

        return;
      }

      try {

        const res = await fetch(
          `/api/location?q=${encodeURIComponent(value)}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch locations");
        }

        const data = await res.json();

        const cleaned = processResults(data, value);

        setResults(cleaned);

        setShow(cleaned.length > 0);

      } catch (error) {

        console.error(
          "Location fetch error:",
          error
        );

        setResults([]);

        setShow(false);
      }

    }, 300);
  };

  // SELECT LOCATION
  const handleSelect = (place) => {

    setQuery(place.full);

    setShow(false);

    setActiveIndex(-1);

    onSelect && onSelect(place);
  };

  // KEYBOARD NAVIGATION
  const handleKeyDown = (e) => {

    if (!show) return;

    if (e.key === "ArrowDown") {

      setActiveIndex((prev) =>
        prev < results.length - 1
          ? prev + 1
          : prev
      );
    }

    if (e.key === "ArrowUp") {

      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }

    if (
      e.key === "Enter" &&
      activeIndex >= 0
    ) {

      handleSelect(
        results[activeIndex]
      );
    }
  };

  // CLEAR INPUT
  const clearInput = () => {

    setQuery("");

    setResults([]);

    setShow(false);

    setActiveIndex(-1);

    onSelect && onSelect(null);
  };

  return (

    <div className="relative w-full">

      <div className="relative">

        <input
          value={query}
          onChange={(e) =>
            fetchPlaces(e.target.value)
          }
          onFocus={() =>
            results.length && setShow(true)
          }
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className="w-full h-10 border border-gray-300 rounded-lg px-3 pr-10 outline-none focus:ring-2 focus:ring-gray-300"
        />

        {query && (

          <button
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg hover:text-black"
          >
            ✕
          </button>

        )}

      </div>

      {show && results.length > 0 && (

        <ul className="absolute w-full bg-white border mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">

          {results.map((place, i) => (

            <li
              key={place.id}
              onClick={() =>
                handleSelect(place)
              }
              className={`p-3 cursor-pointer ${
                i === activeIndex
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              }`}
            >

              <div className="font-medium">
                {place.name}
              </div>

              <div className="text-sm text-gray-500">
                {place.state},{" "}
                {place.country}
              </div>

            </li>

          ))}

        </ul>

      )}

    </div>
  );
}

export default LocationInput;