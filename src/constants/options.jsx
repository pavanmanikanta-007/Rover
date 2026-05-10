export const TravelSizeOptions = [
  {
    id: 1,
    title: "Solo",
    desc: "Exploring the world on your own terms",
    icon: "🧍",
    people: "1",
  },
  {
    id: 2,
    title: "Duo",
    desc: "Traveling together as a pair",
    icon: "👫",
    people: "2",
  },
  {
    id: 3,
    title: "Friends Group",
    desc: "A fun trip with friends",
    icon: "👥",
    people: "3+",
    requiresSize: true,
    type: "group",
  },
  {
    id: 4,
    title: "Family",
    desc: "A trip with your loved ones",
    icon: "👨‍👩‍👧‍👦",
    people: "4+",
    requiresSize: true,
    type: "family",
  },
];


export const BudgetOptions = [
  {
    id: 1,
    title: "Cheap & Reliable",
    desc: "Budget-friendly choices with essential comfort",
    icon: "💸",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Balanced spending with better experiences",
    icon: "💰",
  },
  {
    id: 3,
    title: "Expensive",
    desc: "Premium travel with luxury and comfort",
    icon: "💎",
  },
];

// src/service/AIModal.jsx

export const AI_PROMPT = 
`
Generate a complete travel plan in STRICT JSON format only.

Destination: {location}
Total Days: {totalDays}
Traveler Type: {traveler}
Budget: {budget}

IMPORTANT RULES:
1. Return ONLY valid JSON.
2. Do NOT include markdown.
3. Do NOT include explanations.
4. Do NOT include \`\`\`json fences.
5. Every field must always exist.
6. Never return null.
7. Never change key names.
8. All ratings must always be STRING format like "4.5/5".
9. All prices must always be STRING format.
10. All coordinates must be numbers.
11. Image URLs must be valid HTTPS URLs.
12. Return minimum 4 hotels.
13. Return itinerary for every day.
14. Keep JSON strictly parseable.
15. Do not add extra fields outside the schema.

STRICT JSON SCHEMA:

{
  "tripData": {
    "location": "string",
    "totalDays": number,
    "traveler": "string",
    "budget": "string",

    "hotels": [
      {
        "hotelName": "string",
        "hotelAddress": "string",
        "price": "string",
        "hotelImageUrl": "string",
        "geoCoordinates": {
          "latitude": number,
          "longitude": number
        },
        "rating": "4.5/5",
        "description": "string"
      }
    ],

    "itinerary": [
      {
        "day": number,
        "theme": "string",
        "bestTimeToVisit": "string",

        "places": [
          {
            "placeName": "string",
            "placeDetails": "string",
            "placeImageUrl": "string",
            "geoCoordinates": {
              "latitude": number,
              "longitude": number
            },
            "ticketPricing": "string",
            "travelTime": "string",
            "bestVisitTime": "string"
          }
        ]
      }
    ]
  }
}

QUALITY RULES:
- Hotels must match the budget category.
- Itinerary should minimize unnecessary travel.
- Include famous attractions and hidden gems.
- Include realistic travel times.
- Use concise but informative descriptions.
- Ensure all image URLs are realistic travel/destination images.
- Ratings should be realistic between "3.5/5" and "5/5".

Return ONLY the JSON object.
`;