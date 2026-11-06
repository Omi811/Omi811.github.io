/**
 * Om Panchal Product Studio - Ecosystem Radar Module
 * Fetches real-time telemetry on trending open-source architectures, models, and protocols.
 */

export const StudioRadar = {
  ENDPOINT: "https://raw.githubusercontent.com/boffti/starwire/main/data/repos.json",
  CACHE_KEY: "op_studio_radar_data",
  CACHE_TTL: 86400000,

  async getTrending(limit = 10) {
    const cached = localStorage.getItem(this.CACHE_KEY);
    if (cached) {
      try {
        const item = JSON.parse(cached);
        if (Date.now() - item.ts < this.CACHE_TTL) {
          return item.data.slice(0, limit);
        }
      } catch (e) {}
    }

    try {
      const res = await fetch(this.ENDPOINT);
      if (!res.ok) throw new Error("Radar HTTP " + res.status);
      const data = await res.json();
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
      return data.slice(0, limit);
    } catch (e) {
      console.warn("[StudioRadar] Offline", e);
      return [];
    }
  }
};