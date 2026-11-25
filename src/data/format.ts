import type { CpuReading, GpuReading, MeasuredNumber, ModelRun, Quantity, SwapReading } from "./types.ts";

export function formatMeasured(value: number, decimals: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(measurement: MeasuredNumber): string {
  return formatMeasured(measurement.value, measurement.decimals);
}

export function formatQuantity(quantity: Quantity): string {
  return `${formatNumber(quantity)} ${quantity.unit}`;
}

export function formatPercent(value: number, decimals: number): string {
  return `${formatMeasured(value, decimals)}%`;
}

export function formatCpu(reading: CpuReading): string {
  if (reading.kind === "unreported" || reading.percent === null) {
    return "não informado";
  }
  const percent = formatPercent(reading.percent, reading.decimals);
  return reading.kind === "peak" ? `${percent} pico` : percent;
}

export function formatCpuDetail(reading: CpuReading): string | undefined {
  if (!reading.duringGeneration) {
    return undefined;
  }
  const min = formatNumber(reading.duringGeneration.min);
  const max = formatNumber(reading.duringGeneration.max);
  return `${min}%–${max}% na geração`;
}

export function formatGpu(reading: GpuReading): string {
  if (reading.status === "no-offload") {
    return "sem offload";
  }
  if (reading.status === "unreported" || reading.percent === null) {
    return "não informado";
  }
  return formatPercent(reading.percent, reading.decimals);
}

export function formatSwap(reading: SwapReading): string {
  if (!reading.reported) {
    return "não informado";
  }
  return formatQuantity(reading.quantity);
}

export function formatSeconds(run: Pick<ModelRun, "responseSeconds" | "responseDecimals" | "responseApproximate">): string {
  const prefix = run.responseApproximate ? "~" : "";
  return `${prefix}${formatMeasured(run.responseSeconds, run.responseDecimals)} s`;
}

export function subtractQuantities(used: Quantity, baseline: Quantity): Quantity {
  if (used.unit !== baseline.unit) {
    throw new Error(`Não é possível subtrair ${baseline.unit} de ${used.unit}.`);
  }
  const decimals = Math.max(used.decimals, baseline.decimals);
  const value = Number((used.value - baseline.value).toFixed(decimals));
  return { value, unit: used.unit, decimals };
}
