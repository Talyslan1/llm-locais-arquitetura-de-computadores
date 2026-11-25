const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatCount(value: number, decimals: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function finalLabel(element: HTMLElement): string {
  const value = Number(element.dataset.count);
  const decimals = Number(element.dataset.decimals ?? "0");
  const prefix = element.dataset.prefix ?? "";
  const suffix = element.dataset.suffix ?? "";
  return `${prefix}${formatCount(value, decimals)}${suffix}`;
}

function isHiddenFragment(element: HTMLElement): boolean {
  const fragment = element.closest(".fragment");
  return fragment !== null && !fragment.classList.contains("visible");
}

export function animateVisibleCounts(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>("[data-count]").forEach((element) => {
    if (isHiddenFragment(element)) {
      return;
    }
    const value = Number(element.dataset.count);
    const decimals = Number(element.dataset.decimals ?? "0");
    const prefix = element.dataset.prefix ?? "";
    const suffix = element.dataset.suffix ?? "";
    if (!Number.isFinite(value) || reducedMotion) {
      element.textContent = finalLabel(element);
      return;
    }
    const startedAt = performance.now();
    const duration = 700;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      element.textContent = `${prefix}${formatCount(value * eased, decimals)}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  });
}
