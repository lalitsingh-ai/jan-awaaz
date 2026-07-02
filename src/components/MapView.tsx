import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CATS } from '../theme';
import type { Submission } from '../types';

export default function MapView({ submissions }: { submissions: Submission[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!ref.current || map.current) return;
    map.current = L.map(ref.current).setView([16.2, 80.08], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap', maxZoom: 18,
    }).addTo(map.current);
    layer.current = L.layerGroup().addTo(map.current);
  }, []);

  useEffect(() => {
    if (!layer.current) return;
    layer.current.clearLayers();
    const byKey = new Map<string, { count: number; s: Submission }>();
    for (const s of submissions) {
      const k = `${s.village}-${s.category}`;
      byKey.set(k, { count: (byKey.get(k)?.count ?? 0) + 1, s });
    }
    for (const { count, s } of byKey.values()) {
      const color = CATS[s.category]?.color ?? '#94a3b8';
      L.circleMarker([s.lat, s.lng], {
        radius: 7 + count * 4,
        color,
        fillColor: color,
        fillOpacity: 0.5, weight: 2,
      }).bindPopup(`<b>${CATS[s.category]?.icon ?? ''} ${s.category}</b> hotspot<br/>${s.village} — ${count} report(s)`).addTo(layer.current!);
    }
  }, [submissions]);

  return <div ref={ref} className="h-[380px] w-full rounded-2xl shadow-inner" />;
}
