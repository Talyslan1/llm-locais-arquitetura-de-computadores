import type { EChartsOption } from "echarts";
import { memoryPanels, resourceColumns, resourceSeries, timeBars } from "../data/charts.ts";
import { formatMeasured } from "../data/format.ts";
import { requireValue } from "../data/guard.ts";
import type { Accent } from "../data/types.ts";

interface ChartPoint {
  value: number;
  display: string;
  itemStyle: {
    color: string;
    borderRadius?: number | number[];
    borderColor?: string;
    borderWidth?: number;
  };
}

function token(name: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (value.length === 0) {
    throw new Error(`Token CSS ausente: ${name}`);
  }
  return value;
}

function accentColor(accent: Accent): string {
  return token(`--${accent}`);
}

function axisStyle() {
  const muted = token("--muted");
  const line = token("--line");
  return {
    axisLabel: { color: muted, fontSize: 14 },
    axisLine: { lineStyle: { color: line } },
    splitLine: { lineStyle: { color: line } },
    nameTextStyle: { color: muted },
  };
}

function displayOf(params: { data?: unknown }): string {
  const data = params.data;
  if (typeof data === "object" && data !== null && "display" in data) {
    return String(data.display);
  }
  return "";
}

export function chartOption(kind: string, model: string | undefined, reducedMotion: boolean): EChartsOption {
  const duration = reducedMotion ? 0 : 900;
  if (kind === "time") {
    return timeOption(requireValue(model, "O gráfico de tempo precisa de um modelo."), duration);
  }
  if (kind === "memory") {
    return memoryOption(duration);
  }
  if (kind === "resource") {
    return resourceOption(duration);
  }
  throw new Error(`Gráfico desconhecido: ${kind}`);
}

function timeOption(modelId: string, duration: number): EChartsOption {
  const bars = timeBars(modelId as "qwen35-0.8b" | "qwen35-4b");
  const fastest = bars[0];
  const slowest = bars.at(-1);
  if (!fastest || !slowest) {
    throw new Error("Não há tempos para o gráfico.");
  }
  const text = token("--text");
  const style = axisStyle();
  const data: ChartPoint[] = bars.map((bar) => {
    const prefix = bar.approximate ? "~" : "";
    const isEdge = bar.id === fastest.id || bar.id === slowest.id;
    return {
      value: bar.seconds,
      display: `${prefix}${formatMeasured(bar.seconds, bar.decimals)} s`,
      itemStyle: {
        color: accentColor(bar.accent),
        borderRadius: [0, 10, 10, 0],
        borderColor: isEdge ? token("--text") : "transparent",
        borderWidth: isEdge ? 1 : 0,
      },
    };
  });

  return {
    backgroundColor: "transparent",
    animationDuration: duration,
    animationEasing: "cubicOut",
    grid: { left: 16, right: 88, top: 12, bottom: 28, containLabel: true },
    tooltip: { trigger: "item", formatter: (params) => displayOf(params as { data?: unknown }) },
    xAxis: { type: "value", ...style },
    yAxis: {
      type: "category",
      inverse: true,
      data: bars.map((bar) => bar.name),
      axisLabel: { color: text, fontSize: 16 },
    },
    series: [
      {
        type: "bar",
        data,
        barWidth: 26,
        label: {
          show: true,
          position: "right",
          color: text,
          fontSize: 16,
          formatter: (params) => displayOf(params as { data?: unknown }),
        },
      },
    ],
  };
}

function memoryOption(duration: number): EChartsOption {
  const panels = memoryPanels();
  const text = token("--text");
  const style = axisStyle();
  const width = 18;
  const gap = (100 - width * panels.length) / (panels.length + 1);

  return {
    backgroundColor: "transparent",
    animationDuration: duration,
    animationEasing: "cubicOut",
    title: panels.map((panel, index) => {
      const left = gap + index * (width + gap);
      return {
        text: `${panel.name} · ${panel.unit}`,
        left: `${left + width / 2}%`,
        top: 0,
        textAlign: "center" as const,
        textStyle: { color: text, fontSize: 16, fontWeight: 500 },
      };
    }),
    grid: panels.map((_, index) => ({
      left: `${gap + index * (width + gap)}%`,
      width: `${width}%`,
      top: 48,
      bottom: 28,
    })),
    xAxis: panels.map((panel, index) => ({
      type: "category" as const,
      gridIndex: index,
      data: panel.bars.map((bar) => bar.label),
      axisLabel: style.axisLabel,
      axisLine: style.axisLine,
    })),
    yAxis: panels.map((panel, index) => {
      const peak = Math.max(...panel.bars.map((bar) => bar.value));
      return {
        type: "value" as const,
        gridIndex: index,
        max: peak * 1.45,
        axisLabel: { show: false },
        splitLine: style.splitLine,
      };
    }),
    series: panels.map((panel, index) => ({
      type: "bar" as const,
      xAxisIndex: index,
      yAxisIndex: index,
      barWidth: 28,
      data: panel.bars.map((bar) => ({
        value: bar.value,
        display: `${formatMeasured(bar.value, bar.decimals)} ${panel.unit}`,
        itemStyle: { color: accentColor(panel.accent), borderRadius: [8, 8, 0, 0] },
      })),
      label: {
        show: true,
        position: "top" as const,
        color: text,
        fontSize: 12,
        formatter: (params: { data?: unknown }) => displayOf(params),
      },
    })),
  };
}

function resourceOption(duration: number): EChartsOption {
  const text = token("--text");
  const style = axisStyle();
  const palette = [token("--blue"), token("--violet"), token("--cyan"), token("--amber"), "#7ea2ff", "#c3b6ff"];
  return {
    backgroundColor: "transparent",
    animationDuration: duration,
    animationEasing: "cubicOut",
    legend: { bottom: 0, textStyle: { color: token("--muted") } },
    grid: { left: 16, right: 16, top: 24, bottom: 64, containLabel: true },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: resourceColumns(),
      axisLabel: { color: text, fontSize: 14 },
    },
    yAxis: { type: "value", max: 100, ...style, axisLabel: { ...style.axisLabel, formatter: "{value}%" } },
    series: resourceSeries().map((series, index) => ({
      name: series.name,
      type: "bar" as const,
      data: series.values.map((value) => (value === null ? null : { value, display: `${value}%` })),
      itemStyle: { color: palette[index] ?? token("--blue") },
      barMaxWidth: 18,
    })),
  };
}
