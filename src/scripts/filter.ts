type FilterState = Record<string, Set<string>>;

function init() {
  const grid = document.querySelector<HTMLElement>('[data-filter-grid]');
  const bar = document.querySelector<HTMLElement>('.filter-bar');
  if (!grid || !bar) return;

  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.listing-card'));
  const checkboxes = Array.from(bar.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
  const countEl = bar.querySelector<HTMLElement>('[data-filter-count]');
  const clearBtn = bar.querySelector<HTMLButtonElement>('[data-filter-clear]');
  const searchInput = bar.querySelector<HTMLInputElement>('[data-filter-search]');
  const singular = bar.dataset.nounSingular ?? 'result';
  const plural = bar.dataset.nounPlural ?? 'results';
  const emptyStateEl = document.querySelector<HTMLElement>('[data-filter-empty]');

  function groupChecked(): FilterState {
    const groups: FilterState = {};
    checkboxes.forEach((cb) => {
      if (!groups[cb.name]) groups[cb.name] = new Set();
      if (cb.checked) groups[cb.name].add(cb.value);
    });
    return groups;
  }

  function readParams() {
    const params = new URLSearchParams(window.location.search);
    checkboxes.forEach((cb) => {
      const values = params.get(cb.name)?.split(',') ?? [];
      if (values.includes(cb.value)) cb.checked = true;
    });
    if (searchInput) searchInput.value = params.get('q') ?? '';
  }

  function writeParams() {
    const params = new URLSearchParams();
    const groups = groupChecked();
    for (const [key, values] of Object.entries(groups)) {
      if (values.size) params.set(key, Array.from(values).join(','));
    }
    if (searchInput?.value) params.set('q', searchInput.value);
    const query = params.toString();
    const newUrl = query ? `${location.pathname}?${query}` : location.pathname;
    history.replaceState(null, '', newUrl);
  }

  function apply() {
    const groups = groupChecked();
    const query = searchInput?.value.trim().toLowerCase() ?? '';
    let visibleCount = 0;

    cards.forEach((card) => {
      let visible = true;
      for (const [key, values] of Object.entries(groups)) {
        if (values.size === 0) continue;
        const cardValues = (card.dataset[key] ?? '').split(',');
        if (!cardValues.some((v) => values.has(v))) {
          visible = false;
          break;
        }
      }
      if (visible && query) {
        visible = (card.textContent ?? '').toLowerCase().includes(query);
      }
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (countEl) {
      countEl.textContent = `${visibleCount} ${visibleCount === 1 ? singular : plural} match your filters`;
    }
    if (emptyStateEl) {
      emptyStateEl.hidden = visibleCount !== 0;
    }
    writeParams();
  }

  checkboxes.forEach((cb) => cb.addEventListener('change', apply));
  searchInput?.addEventListener('input', apply);
  clearBtn?.addEventListener('click', () => {
    checkboxes.forEach((cb) => (cb.checked = false));
    if (searchInput) searchInput.value = '';
    apply();
  });

  readParams();
  apply();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
