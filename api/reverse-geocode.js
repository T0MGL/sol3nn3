/**
 * Vercel Serverless Function - /api/reverse-geocode
 * Convierte coordenadas GPS en dirección legible.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  const googleKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!googleKey) {
    return res.status(200).json({
      address: 'Paraguay',
      city: 'Paraguay',
      formattedAddress: 'Paraguay',
      lat: latitude,
      lng: longitude,
      usesFallback: true,
      googleMapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
    });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleKey}&language=es`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      let city = 'Paraguay';
      let locality = null;

      for (const component of result.address_components) {
        if (component.types.includes('locality')) {
          locality = component.long_name;
        } else if (component.types.includes('administrative_area_level_2')) {
          city = component.long_name;
        } else if (component.types.includes('administrative_area_level_1') && !locality) {
          city = component.long_name;
        }
      }

      if (locality) city = locality;

      return res.status(200).json({
        address: result.formatted_address,
        city,
        formattedAddress: result.formatted_address,
        lat: latitude,
        lng: longitude,
        usesFallback: false,
        googleMapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
      });
    }

    return res.status(200).json({
      address: 'Paraguay',
      city: 'Paraguay',
      formattedAddress: 'Paraguay',
      lat: latitude,
      lng: longitude,
      usesFallback: true,
      googleMapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
    });
  } catch (error) {
    return res.status(200).json({
      address: 'Paraguay',
      city: 'Paraguay',
      formattedAddress: 'Paraguay',
      lat: latitude,
      lng: longitude,
      usesFallback: true,
      googleMapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
      error: error.message,
    });
  }
}
