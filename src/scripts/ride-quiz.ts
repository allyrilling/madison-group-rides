export {};

function init() {
  const root = document.querySelector<HTMLElement>('[data-ride-quiz]');
  const filterBar = document.querySelector<HTMLElement>('.filter-bar');
  const grid = document.querySelector<HTMLElement>('[data-filter-grid]');
  if (!root || !filterBar) return;

  const toggleBtn = root.querySelector<HTMLButtonElement>('[data-ride-quiz-toggle]');
  const panel = root.querySelector<HTMLElement>('[data-ride-quiz-panel]');
  const submitBtn = root.querySelector<HTMLButtonElement>('[data-ride-quiz-submit]');
  const resetBtn = root.querySelector<HTMLButtonElement>('[data-ride-quiz-reset]');
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-quiz-value]'));

  toggleBtn?.addEventListener('click', () => {
    if (!panel) return;
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    panel.hidden = expanded;
    toggleBtn.setAttribute('aria-expanded', String(!expanded));
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('is-selected');
    });
  });

  resetBtn?.addEventListener('click', () => {
    chips.forEach((chip) => chip.classList.remove('is-selected'));
  });

  submitBtn?.addEventListener('click', () => {
    const answers = new Map<string, Set<string>>();
    chips.forEach((chip) => {
      if (!chip.classList.contains('is-selected')) return;
      const group = chip.closest<HTMLElement>('[data-quiz-group]')?.dataset.quizGroup;
      const value = chip.dataset.quizValue;
      if (!group || !value) return;
      if (!answers.has(group)) answers.set(group, new Set());
      answers.get(group)!.add(value);
    });

    const checkboxes = Array.from(filterBar.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    checkboxes.forEach((cb) => {
      const wanted = answers.get(cb.name);
      const shouldCheck = wanted ? wanted.has(cb.value) : false;
      if (cb.checked !== shouldCheck) {
        cb.checked = shouldCheck;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    const filterPanel = filterBar.querySelector<HTMLElement>('[data-filter-panel]');
    const filterToggle = filterBar.querySelector<HTMLButtonElement>('[data-filter-toggle]');
    if (filterPanel && filterToggle) {
      filterPanel.hidden = false;
      filterToggle.setAttribute('aria-expanded', 'true');
    }

    (grid ?? filterBar).scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
