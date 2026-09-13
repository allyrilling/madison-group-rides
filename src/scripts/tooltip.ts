export {};

function init() {
  const tags = Array.from(document.querySelectorAll<HTMLElement>('.tag[data-tooltip]'));
  if (tags.length === 0) return;

  function closeAll() {
    tags.forEach((t) => t.classList.remove('is-open'));
  }

  function toggle(tag: HTMLElement) {
    const isOpen = tag.classList.contains('is-open');
    closeAll();
    if (!isOpen) tag.classList.add('is-open');
  }

  tags.forEach((tag) => {
    const tooltip = tag.dataset.tooltip ?? '';
    const label = tag.textContent?.trim() ?? '';
    tag.setAttribute('aria-label', tooltip ? `${label} — ${tooltip}` : label);
    tag.setAttribute('role', 'button');
    tag.tabIndex = 0;

    tag.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle(tag);
    });

    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(tag);
      }
    });
  });

  document.addEventListener('click', closeAll);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
