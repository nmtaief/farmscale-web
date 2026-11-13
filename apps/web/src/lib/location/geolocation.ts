/**
 * Browser Geolocation & Coordinate Matching Utility for FarmScale.
 * Accesses user GPS location directly from the browser and matches
 * coordinates to regional pilot districts and upazilas.
 */

import type { LocationInfo } from "@/lib/store/useAppStore";

export interface KnownArea {
  name: string;
  upazila?: string;
  district: string;
  lat: number;
  lon: number;
  isPilot: boolean;
}

export const KNOWN_AREAS: KnownArea[] = [
  // Rajshahi Division Pilot Upazilas
  { name: "Rajshahi Sadar, Barind", upazila: "Rajshahi Sadar", district: "Rajshahi", lat: 24.3745, lon: 88.6042, isPilot: true },
  { name: "Godagari Upazila, Barind", upazila: "Godagari", district: "Rajshahi", lat: 24.4667, lon: 88.3333, isPilot: true },
  { name: "Tanore Upazila", upazila: "Tanore", district: "Rajshahi", lat: 24.5833, lon: 88.5750, isPilot: true },
  { name: "Paba Upazila", upazila: "Paba", district: "Rajshahi", lat: 24.4333, lon: 88.6250, isPilot: true },
  { name: "Bagmara Upazila", upazila: "Bagmara", district: "Rajshahi", lat: 24.5647, lon: 88.8056, isPilot: true },
  { name: "Durgapur Upazila", upazila: "Durgapur", district: "Rajshahi", lat: 24.4556, lon: 88.7667, isPilot: true },
  { name: "Charghat Upazila", upazila: "Charghat", district: "Rajshahi", lat: 24.2833, lon: 88.7500, isPilot: true },
  { name: "Bagha Upazila", upazila: "Bagha", district: "Rajshahi", lat: 24.1889, lon: 88.8333, isPilot: true },
  { name: "Mohanpur Upazila", upazila: "Mohanpur", district: "Rajshahi", lat: 24.5333, lon: 88.6500, isPilot: true },
  
  // Surrounding Rajshahi Division Districts
  { name: "Chapainawabganj Sadar", upazila: "Sadar", district: "Chapainawabganj", lat: 24.5965, lon: 88.2775, isPilot: true },
  { name: "Shibganj Upazila", upazila: "Shibganj", district: "Chapainawabganj", lat: 24.6833, lon: 88.1667, isPilot: true },
  { name: "Naogaon Sadar", upazila: "Sadar", district: "Naogaon", lat: 24.8167, lon: 88.9333, isPilot: true },
  { name: "Niamatpur Upazila", upazila: "Niamatpur", district: "Naogaon", lat: 24.8500, lon: 88.5667, isPilot: true },
  { name: "Natore Sadar", upazila: "Sadar", district: "Natore", lat: 24.4167, lon: 88.9833, isPilot: true },
  { name: "Singra Upazila (Chalan Beel)", upazila: "Singra", district: "Natore", lat: 24.5000, lon: 89.1500, isPilot: true },
  { name: "Bogura Sadar", upazila: "Sadar", district: "Bogura", lat: 24.8465, lon: 89.3777, isPilot: true },
  { name: "Pabna Sadar", upazila: "Sadar", district: "Pabna", lat: 24.0064, lon: 89.2483, isPilot: true },
  { name: "Joypurhat Sadar", upazila: "Sadar", district: "Joypurhat", lat: 25.0947, lon: 89.0279, isPilot: true },
  { name: "Sirajganj Sadar", upazila: "Sadar", district: "Sirajganj", lat: 24.4534, lon: 89.7008, isPilot: true },

  // Major Bangladesh Divisions
  { name: "Dhaka Central", district: "Dhaka", lat: 23.8103, lon: 90.4125, isPilot: false },
  { name: "Chittagong", district: "Chittagong", lat: 22.3569, lon: 91.7832, isPilot: false },
  { name: "Sylhet", district: "Sylhet", lat: 24.8949, lon: 91.8687, isPilot: false },
  { name: "Khulna", district: "Khulna", lat: 22.8456, lon: 89.5403, isPilot: false },
  { name: "Barisal", district: "Barisal", lat: 22.7010, lon: 90.3535, isPilot: false },
  { name: "Rangpur", district: "Rangpur", lat: 25.7439, lon: 89.2752, isPilot: false },
  { name: "Mymensingh", district: "Mymensingh", lat: 24.7471, lon: 90.4203, isPilot: false },
];

/**
 * Calculates straight distance between two lat/lon pairs in kilometers (Haversine formula).
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Matches coordinates to the closest known district or upazila.
 */
export function matchCoordinatesToLocation(lat: number, lon: number): LocationInfo {
  let closest: KnownArea = KNOWN_AREAS[0];
  let minDistance = calculateDistanceKm(lat, lon, closest.lat, closest.lon);

  for (const area of KNOWN_AREAS) {
    const dist = calculateDistanceKm(lat, lon, area.lat, area.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closest = area;
    }
  }

  // If within 30 km of known area, use that area's contextual naming
  if (minDistance <= 30) {
    return {
      name: `${closest.name} (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E)`,
      lat: Math.round(lat * 10000) / 10000,
      lon: Math.round(lon * 10000) / 10000,
      district: closest.district,
      isPilot: closest.isPilot,
    };
  }

  // Otherwise, use generic GPS coordinate name with closest district indicator
  return {
    name: `Field GPS (${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E)`,
    lat: Math.round(lat * 10000) / 10000,
    lon: Math.round(lon * 10000) / 10000,
    district: closest.district,
    isPilot: closest.isPilot && minDistance < 75,
  };
}

export type GeolocationStatus = "idle" | "requesting" | "success" | "error" | "unsupported";

export interface GeolocationResult {
  status: GeolocationStatus;
  location?: LocationInfo;
  error?: string;
}

/**
 * Request GPS location from the browser navigator.geolocation API.
 */
export async function requestUserLocation(): Promise<GeolocationResult> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    return {
      status: "unsupported",
      error: "Geolocation is not supported by your browser.",
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const matched = matchCoordinatesToLocation(latitude, longitude);
        resolve({
          status: "success",
          location: matched,
        });
      },
      (err) => {
        let msg = "Could not access location.";
        if (err.code === err.PERMISSION_DENIED) {
          msg = "Location permission was denied. Please allow location access or choose from the list.";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = "GPS location is currently unavailable.";
        } else if (err.code === err.TIMEOUT) {
          msg = "Location request timed out. Please try again.";
        }
        resolve({
          status: "error",
          error: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

