import { Office } from '../types';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export function getDirectionsUrl(office: Office): string {
  const query = encodeURIComponent(`${office.name}, ${office.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getMapEmbedUrl(office: Office): string {
  if (GOOGLE_MAPS_API_KEY) {
    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${office.latitude},${office.longitude}`;
  }
  return `https://www.openstreetmap.org/export/embed.html?bbox=${office.longitude - 0.01}%2C${office.latitude - 0.01}%2C${office.longitude + 0.01}%2C${office.latitude + 0.01}&layer=mapnik&marker=${office.latitude}%2C${office.longitude}`;
}