import L from 'leaflet';

interface MapMarker {
  id: string;
  kind: 'ride' | 'event';
  name: string;
  organizerName?: string;
  lat: number;
  lng: number;
  href: string;
  summary: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pinIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<span class="map-pin" style="background:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -20],
  });
}

function init() {
  const container = document.getElementById('ride-map');
  const dataEl = document.getElementById('map-data');
  if (!container || !dataEl) return;

  const markers: MapMarker[] = JSON.parse(dataEl.textContent ?? '[]');

  const map = L.map(container, { scrollWheelZoom: false });
  map.setView([43.075, -89.45], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  const rideIcon = pinIcon('#29abe2');
  const eventIcon = pinIcon('#c5050c');
  const bounds: [number, number][] = [];

  markers.forEach((m) => {
    const icon = m.kind === 'ride' ? rideIcon : eventIcon;
    const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
    const organizerLine = m.organizerName ? `${escapeHtml(m.organizerName)}<br>` : '';
    marker.bindPopup(
      `<div class="map-popup"><strong>${escapeHtml(m.name)}</strong>${organizerLine}${escapeHtml(m.summary)}<br><a href="${m.href}">View details →</a></div>`
    );
    bounds.push([m.lat, m.lng]);
  });

  if (bounds.length > 1) {
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  } else if (bounds.length === 1) {
    map.setView(bounds[0], 14);
  }

  container.addEventListener('click', () => map.scrollWheelZoom.enable());
  container.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
