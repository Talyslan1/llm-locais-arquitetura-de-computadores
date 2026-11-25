import * as echarts from "echarts";
import Reveal from "reveal.js";
import RevealNotes from "reveal.js/plugin/notes";
import { chartOption } from "./chart-options.ts";
import { animateVisibleCounts } from "./counters.ts";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const charts = new Map<HTMLElement, echarts.ECharts>();

const deck = new Reveal({
  hash: true,
  width: 1920,
  height: 1080,
  margin: 0.04,
  minScale: 0.2,
  maxScale: 2,
  center: false,
  progress: true,
  slideNumber: "c/t",
  controls: false,
  fragments: false,
  overview: true,
  transition: reducedMotion ? "none" : "fade",
  backgroundTransition: reducedMotion ? "none" : "fade",
  transitionSpeed: "fast",
  autoAnimate: !reducedMotion,
  autoAnimateDuration: 0.55,
  plugins: [RevealNotes()],
});

function renderCharts(slide: HTMLElement): void {
  slide.querySelectorAll<HTMLElement>("[data-chart]").forEach((host) => {
    const kind = host.dataset.chart;
    if (!kind) {
      return;
    }
    const chart = charts.get(host) ?? echarts.init(host, null, { renderer: "canvas" });
    charts.set(host, chart);
    chart.resize();
    chart.setOption(chartOption(kind, host.dataset.model, reducedMotion), true);
  });
}

function showSlide(slide: HTMLElement | null): void {
  if (!slide) {
    return;
  }
  animateVisibleCounts(slide);
  renderCharts(slide);
}

function bindParallax(): void {
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((stage) => {
    stage.addEventListener("pointermove", (event) => {
      if (reducedMotion) {
        return;
      }
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      stage.style.setProperty("--px", `${(x * 12).toFixed(1)}px`);
      stage.style.setProperty("--py", `${(y * 8).toFixed(1)}px`);
    });
    stage.addEventListener("pointerleave", () => {
      stage.style.setProperty("--px", "0px");
      stage.style.setProperty("--py", "0px");
    });
  });
}

deck.initialize().then(() => {
  deck.addKeyBinding({ keyCode: 36, key: "Home", description: "Voltar ao início" }, () => {
    deck.slide(0, 0, 0);
  });

  deck.on("ready", () => showSlide(deck.getCurrentSlide()));
  deck.on("slidechanged", (event) => {
    const slide = "currentSlide" in event ? event.currentSlide : deck.getCurrentSlide();
    showSlide(slide instanceof HTMLElement ? slide : deck.getCurrentSlide());
  });
  deck.on("overviewshown", () => document.body.classList.add("is-overview"));
  deck.on("overviewhidden", () => document.body.classList.remove("is-overview"));
  deck.on("resize", () => charts.forEach((chart) => chart.resize()));

  document.querySelector(".edge-next")?.addEventListener("click", () => {
    if (!deck.isOverview()) {
      deck.next();
    }
  });
  document.querySelector(".edge-prev")?.addEventListener("click", () => {
    if (!deck.isOverview()) {
      deck.prev();
    }
  });

  bindParallax();
});
