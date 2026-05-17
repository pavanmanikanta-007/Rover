export default async function handler(req, res) {

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      error: "Query missing"
    });
  }

  try {

    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=10`,
      {
        headers: {
          "User-Agent": "Rover-App",
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Photon API error: ${response.status}`
      );
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch locations",
      details: error.message,
    });

  }
}