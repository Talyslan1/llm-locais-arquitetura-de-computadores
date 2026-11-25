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

const chartFont = '"Poppins", sans-serif';

function axisStyle() {
  const muted = token("--muted");
  const line = token("--line");
  return {
    axisLabel: { color: muted, fontSize: 24, fontFamily: chartFont },
    axisLine: { lineStyle: { color: line } },
    splitLine: { lineStyle: { color: line } },
    nameTextStyle: { color: muted, fontSize: 22, fontFamily: chartFont },
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

  const isLargeModel = modelId === "qwen35-4b";

  return {
    backgroundColor: "transparent",
    textStyle: { fontFamily: chartFont },
    animationDuration: duration,
    animationEasing: "cubicOut",
    grid: { left: 8, right: 148, top: 8, bottom: 16, containLabel: true },
    tooltip: { trigger: "item", formatter: (params) => displayOf(params as { data?: unknown }) },
    xAxis: { type: "value", ...style },
    yAxis: {
      type: "category",
      inverse: true,
      data: bars.map((bar) => bar.name),
      axisLabel: { color: text, fontSize: 28, fontWeight: 540, fontFamily: chartFont },
    },
    series: [
      {
        type: "bar",
        data,
        barWidth: isLargeModel ? 48 : 42,
        label: {
          show: true,
          position: "right",
          color: isLargeModel ? token("--cyan") : text,
          fontSize: 28,
          fontWeight: isLargeModel ? 600 : 500,
          fontFamily: chartFont,
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
    textStyle: { fontFamily: chartFont },
    animationDuration: duration,
    animationEasing: "cubicOut",
    title: panels.map((panel, index) => {
      const left = gap + index * (width + gap);
      return {
        text: `${panel.name} · ${panel.unit}`,
        left: `${left + width / 2}%`,
        top: 0,
        textAlign: "center" as const,
        textStyle: { color: text, fontSize: 26, fontWeight: 540, fontFamily: chartFont },
      };
    }),
    grid: panels.map((_, index) => ({
      left: `${gap + index * (width + gap)}%`,
      width: `${width}%`,
      top: 56,
      bottom: 28,
    })),
    xAxis: panels.map((panel, index) => ({
      type: "category" as const,
      gridIndex: index,
      data: panel.bars.map((bar) => bar.label),
      axisLabel: {
        ...style.axisLabel,
        fontSize: 22,
        fontWeight: 540,
        color: (value?: string | number) => (String(value) === "4B" ? token("--cyan") : token("--muted")),
      },
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
      barWidth: 40,
      data: panel.bars.map((bar) => {
        const isLarge = bar.label === "4B";
        return {
          value: bar.value,
          display: `${formatMeasured(bar.value, bar.decimals)} ${panel.unit}`,
          itemStyle: {
            color: accentColor(panel.accent),
            opacity: isLarge ? 1 : 0.45,
            borderRadius: [8, 8, 0, 0],
            borderColor: isLarge ? token("--cyan") : "transparent",
            borderWidth: isLarge ? 2 : 0,
          },
        };
      }),
      label: {
        show: true,
        position: "top" as const,
        color: text,
        fontSize: 22,
        fontWeight: 540,
        fontFamily: chartFont,
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
    textStyle: { fontFamily: chartFont },
    animationDuration: duration,
    animationEasing: "cubicOut",
    legend: {
      bottom: 0,
      itemGap: 18,
      textStyle: { color: token("--muted"), fontSize: 20, fontFamily: chartFont },
    },
    grid: { left: 16, right: 16, top: 36, bottom: 72, containLabel: true },
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const rows = Array.isArray(params) ? params : [params];
        const title = rows[0] && "axisValueLabel" in rows[0] ? String(rows[0].axisValueLabel) : "";
        const lines = rows.flatMap((row) => {
          const data = "data" in row ? row.data : null;
          if (data === null || data === undefined) {
            return [];
          }
          const name = "seriesName" in row ? String(row.seriesName) : "";
          return [`${name}: ${displayOf({ data })}`];
        });
        return [title, ...lines].filter((line) => line.length > 0).join("<br/>");
      },
    },
    xAxis: {
      type: "category",
      data: resourceColumns(),
      axisLabel: { color: text, fontSize: 24, fontWeight: 540, fontFamily: chartFont },
    },
    yAxis: {
      type: "value",
      max: 100,
      ...style,
      axisLabel: { ...style.axisLabel, formatter: "{value}%" },
    },
    series: resourceSeries().map((series, index) => {
      const isLarge = series.name.endsWith("4B");
      return {
        name: series.name,
        type: "bar" as const,
        data: series.values.map((value) => (value === null ? null : { value, display: `${value}%` })),
        itemStyle: {
          color: palette[index] ?? token("--blue"),
          opacity: isLarge ? 1 : 0.4,
          borderColor: isLarge ? token("--cyan") : "transparent",
          borderWidth: isLarge ? 1.5 : 0,
        },
        barMaxWidth: isLarge ? 34 : 26,
        label: {
          show: true,
          position: "top" as const,
          color: text,
          fontSize: 16,
          fontFamily: chartFont,
          formatter: (params: { data?: unknown }) => {
            const data = params.data;
            if (typeof data === "object" && data !== null && "value" in data && data.value === 0) {
              return "0%";
            }
            return "";
          },
        },
      };
    }),
  };
}
