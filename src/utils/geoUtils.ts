// Geo utility service - Gets IP address and location data
// Uses free APIs: ipify.org for IP, ip-api.com for geolocation

export interface GeoData {
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
}

// Cache the geo data to avoid repeated API calls
let cachedGeoData: GeoData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

/**
 * Get the user's IP address using ipify API
 */
export async function getIpAddress(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.ip || null;
    }
    return null;
  } catch (error) {
    console.warn('Failed to get IP address:', error);
    return null;
  }
}

/**
 * Get geolocation data from IP using ip-api.com (free, no API key needed)
 * Rate limit: 45 requests per minute
 */
export async function getGeoFromIp(ip: string): Promise<Omit<GeoData, 'ip'> | null> {
  try {
    // ip-api.com free tier (HTTP only, but works for our purpose)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city,timezone`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success' || data.country) {
        return {
          country: data.country || null,
          region: data.regionName || null,
          city: data.city || null,
          timezone: data.timezone || null,
        };
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to get geolocation:', error);
    return null;
  }
}

/**
 * Alternative: Use ipapi.co (HTTPS, free tier: 1000/day)
 */
export async function getGeoFromIpSecure(ip: string): Promise<Omit<GeoData, 'ip'> | null> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (!data.error) {
        return {
          country: data.country_name || null,
          region: data.region || null,
          city: data.city || null,
          timezone: data.timezone || null,
        };
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to get geolocation (secure):', error);
    return null;
  }
}

/**
 * Get complete geo data (IP + location) with caching
 */
export async function getGeoData(): Promise<GeoData> {
  // Return cached data if still valid
  const now = Date.now();
  if (cachedGeoData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedGeoData;
  }

  const result: GeoData = {
    ip: null,
    country: null,
    region: null,
    city: null,
    timezone: null,
  };

  try {
    // Step 1: Get IP address
    const ip = await getIpAddress();
    result.ip = ip;

    // Step 2: Get geolocation from IP
    if (ip) {
      // Try HTTPS first, fallback to HTTP
      let geoData = await getGeoFromIpSecure(ip);
      
      if (!geoData) {
        geoData = await getGeoFromIp(ip);
      }

      if (geoData) {
        result.country = geoData.country;
        result.region = geoData.region;
        result.city = geoData.city;
        result.timezone = geoData.timezone;
      }
    }

    // Cache the result
    cachedGeoData = result;
    cacheTimestamp = now;

  } catch (error) {
    console.error('Error getting geo data:', error);
  }

  return result;
}

/**
 * Get browser/device info
 */
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(', ') || navigator.language,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
  };
}
