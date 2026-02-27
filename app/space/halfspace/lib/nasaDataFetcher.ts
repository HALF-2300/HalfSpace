/**
 * NASA Data Fetcher
 * Fetches real data from NASA and other space APIs
 */

// NASA API Key - Get free key at https://api.nasa.gov/
const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

interface ExoplanetData {
  total: number;
  habitable: number;
  withAtmospheres: number;
}

interface GravitationalWaveData {
  total: number;
  blackHoleMergers: number;
  neutronStarMergers: number;
}

export interface CosmicData {
  exoplanets: ExoplanetData;
  gravitationalWaves: GravitationalWaveData;
  lastUpdated: string;
}

/**
 * Fetch exoplanet data from NASA Exoplanet Archive
 */
export async function fetchExoplanetData(): Promise<ExoplanetData> {
  try {
    // NASA Exoplanet Archive TAP API
    const response = await fetch(
      'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+count(*)+from+pscomppars&format=json',
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );
    
    if (response.ok) {
      const data = await response.json();
      const total = data[0]?.count || 5612;
      
      return {
        total,
        habitable: Math.floor(total * 0.003), // Rough estimate of potentially habitable
        withAtmospheres: Math.floor(total * 0.0004), // Rough estimate with characterized atmospheres
      };
    }
  } catch (error) {
    console.error('Failed to fetch exoplanet data:', error);
  }
  
  // Fallback data
  return {
    total: 5612,
    habitable: 17,
    withAtmospheres: 2,
  };
}

/**
 * Fetch gravitational wave data
 */
export async function fetchGravitationalWaveData(): Promise<GravitationalWaveData> {
  // LIGO doesn't have a public real-time API, so we use updated estimates
  // Data from: https://www.gw-openscience.org/eventapi/
  
  return {
    total: 90,
    blackHoleMergers: 70,
    neutronStarMergers: 3,
  };
}

/**
 * Fetch Astronomy Picture of the Day
 */
export async function fetchAPOD() {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
      { next: { revalidate: 86400 } }
    );
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch APOD:', error);
  }
  
  return null;
}

/**
 * Fetch Near-Earth Object data
 */
export async function fetchNEOData() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (response.ok) {
      const data = await response.json();
      return {
        count: data.element_count || 0,
        today: data.near_earth_objects?.[today] || [],
      };
    }
  } catch (error) {
    console.error('Failed to fetch NEO data:', error);
  }
  
  return { count: 0, today: [] };
}

/**
 * Fetch all cosmic data
 */
export async function fetchAllCosmicData(): Promise<CosmicData> {
  const [exoplanets, gravitationalWaves] = await Promise.all([
    fetchExoplanetData(),
    fetchGravitationalWaveData(),
  ]);
  
  return {
    exoplanets,
    gravitationalWaves,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get cached data or fetch new
 */
let cachedData: CosmicData | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function getCosmicData(): Promise<CosmicData> {
  const now = Date.now();
  
  if (cachedData && (now - cacheTime) < CACHE_DURATION) {
    return cachedData;
  }
  
  cachedData = await fetchAllCosmicData();
  cacheTime = now;
  
  return cachedData;
}
