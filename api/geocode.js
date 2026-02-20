/**
 * Vercel Serverless Function - /api/geocode
 * Convierte dirección en coordenadas y link de Google Maps.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address, city } = req.body;

  if (!address && !city) {
    return res.status(400).json({ error: 'Address or city is required' });
  }

  const googleKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!googleKey) {
    const fullAddress = address ? `${address}, ${city}` : city;
    return res.status(200).json({
      googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
      address: fullAddress,
      usesFallback: true,
    });
  }

  try {
    const fullAddress = address ? `${address}, ${city}, Paraguay` : `${city}, Paraguay`;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${googleKey}`;

    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return res.status(200).json({
        googleMapsLink: `https://www.google.com/maps?q=${location.lat},${location.lng}`,
        address: data.results[0].formatted_address,
        lat: location.lat,
        lng: location.lng,
        usesFallback: false,
      });
    }

    const fullAddressFallback = address ? `${address}, ${city}` : city;
    return res.status(200).json({
      googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressFallback)}`,
      address: fullAddressFallback,
      usesFallback: true,
    });
  } catch (error) {
    const fullAddress = address ? `${address}, ${city}` : city;
    return res.status(200).json({
      googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
      address: fullAddress,
      usesFallback: true,
      error: error.message,
    });
  }
}
