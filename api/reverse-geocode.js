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
      address: '',
      city: 'Paraguay',
      neighborhood: null,
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

      // Paraguay address parsing rules (validated against carrier_coverage):
      // - city  = administrative_area_level_2 (real municipality, e.g. "Asuncion", "San Lorenzo", "Lambare")
      // - barrio = locality OR sublocality_level_1 (e.g. "Villa Aurelia", "Sajonia") -> NEVER goes to city
      // - admin_area_level_1 = "Departamento Central" / "Asuncion" -> only used as fallback when level_2 missing
      // Acentos se preservan tal como vienen de Google. Ordefy `normalize_location_text`
      // hace matching accent-insensitive, asi que mandar "Asuncion" calza con "Asuncion" o "Asuncion".
      let city = null;
      let neighborhood = null;
      let adminLevel1 = null;
      let route = null;
      let streetNumber = null;

      for (const component of result.address_components) {
        const types = component.types;
        if (types.includes('administrative_area_level_2')) {
          city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          adminLevel1 = component.long_name;
        } else if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
          if (!neighborhood) neighborhood = component.long_name;
        } else if (types.includes('neighborhood') && !neighborhood) {
          neighborhood = component.long_name;
        } else if (types.includes('locality') && !neighborhood) {
          // En PY locality suele ser barrio (Villa Aurelia, Sajonia), NO ciudad.
          // Lo guardamos como neighborhood unless city aun esta vacio y locality
          // matches admin_area_level_1 (capital case: locality === "Asuncion" === admin_1).
          neighborhood = component.long_name;
        } else if (types.includes('route')) {
          route = component.long_name;
        } else if (types.includes('street_number')) {
          streetNumber = component.long_name;
        }
      }

      // Fallback: si no hay admin_area_level_2 (rural / coordenada incompleta),
      // usar admin_area_level_1 como city. Si tampoco existe, "Paraguay".
      if (!city) {
        if (adminLevel1) {
          city = adminLevel1;
        } else if (neighborhood) {
          // Como ultimo recurso si solo tenemos barrio sin ciudad, promover.
          city = neighborhood;
          neighborhood = null;
        } else {
          city = 'Paraguay';
        }
      }

      // Edge case: si city y neighborhood son identicos (ej Asuncion centro),
      // no duplicar.
      if (neighborhood && city && neighborhood.toLowerCase() === city.toLowerCase()) {
        neighborhood = null;
      }

      // Construir address legible: "Calle 1234" si Google nos dio street + number.
      let address = '';
      if (route) {
        address = streetNumber ? `${route} ${streetNumber}` : route;
      }

      return res.status(200).json({
        address,
        city,
        neighborhood,
        formattedAddress: result.formatted_address,
        lat: latitude,
        lng: longitude,
        usesFallback: false,
        googleMapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
      });
    }

    return res.status(200).json({
      address: '',
      city: 'Paraguay',
      neighborhood: null,
      formattedAddress: 'Paraguay',
      lat: latitude,
      lng: longitude,
      usesFallback: true,
      googleMapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
    });
  } catch (error) {
    return res.status(200).json({
      address: '',
      city: 'Paraguay',
      neighborhood: null,
      formattedAddress: 'Paraguay',
      lat: latitude,
      lng: longitude,
      usesFallback: true,
      googleMapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
      error: error.message,
    });
  }
}
