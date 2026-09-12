import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

maplibregl.setWorkerUrl(maplibreWorkerUrl);

interface OrganizerMarker {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pinEl(color: string): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = 'map-pin';
  el.style.background = color;
  return el;
}

function init() {
  const container = document.getElementById('organizer-map');
  const dataEl = document.getElementById('organizer-map-data');
  if (!container || !dataEl) return;

  const markers: OrganizerMarker[] = JSON.parse(dataEl.textContent ?? '[]');

  const map = new maplibregl.Map({
    container,
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [-89.45, 43.075],
    zoom: 11,
    scrollZoom: false,
    attributionControl: { compact: true },
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

  const bounds = new maplibregl.LngLatBounds();

  markers.forEach((m) => {
    const addressLine = m.address ? `${escapeHtml(m.address)}<br>` : '';
    const popup = new maplibregl.Popup({ offset: 20 }).setHTML(
      `<div class="map-popup"><strong>${escapeHtml(m.name)}</strong><br>${addressLine}<a href="#${m.id}">View in list ↓</a></div>`
    );
    new maplibregl.Marker({ element: pinEl('#f0b323'), anchor: 'bottom' })
      .setLngLat([m.lng, m.lat])
      .setPopup(popup)
      .addTo(map);
    bounds.extend([m.lng, m.lat]);
  });

  if (markers.length > 1) {
    map.fitBounds(bounds, { padding: 40, maxZoom: 14 });
  } else if (markers.length === 1) {
    map.setCenter([markers[0].lng, markers[0].lat]);
    map.setZoom(14);
  }

  container.addEventListener('click', () => map.scrollZoom.enable());
  container.addEventListener('mouseleave', () => map.scrollZoom.disable());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
