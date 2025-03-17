const GEOAPIFY_API_KEY = "5eccdbc458e94cc98c9ac7a013754c83";

export function getMapPreview(latitude, longitude) {
  const imagePreviewUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=400&height=200&center=lonlat%3A${longitude}%2C${latitude}&zoom=14.3497&marker=lonlat%3A${longitude}%2C${latitude}%3Btype%3Aawesome%3Bcolor%3A%23ff0000%3Bsize%3Ax-large%3Bicon%3Apaw&apiKey=${GEOAPIFY_API_KEY}`;
    return imagePreviewUrl;
}

export async function getAddress(latitude, longitude){
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`;
  const response = await fetch(url);

  if(!response.ok){
    throw new Error('Failed to fetch address');
  }

  const data = response.json();
  const address = data.features[0].properties.formatted;
  return address;
}