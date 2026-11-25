import { memoryDelta, modelById } from "./experiments.ts";
import { formatCpu, formatCpuDetail, formatGpu } from "./format.ts";
import { participants } from "./participants/index.ts";
import type { Accent, GpuReading, ModelId, Participant } from "./types.ts";

export interface TimeBar {
  id: string;
  name: string;
  seconds: number;
  decimals: number;
  approximate: boolean;
  accent: Accent;
}

export interface MemoryPanel {
  id: string;
  name: string;
  unit: string;
  accent: Accent;
  bars: readonly { label: string; value: number; decimals: number }[];
}

export interface ResourceSeries {
  name: string;
  values: readonly (number | null)[];
}

export interface ResourceTableRow {
  label: string;
  cells: readonly string[];
}

function byResponse(modelId: ModelId): Participant[] {
  return [...participants].sort(
    (left, right) => left.models[modelId].responseSeconds - right.models[modelId].responseSeconds,
  );
}

export function timeBars(modelId: ModelId): TimeBar[] {
  return byResponse(modelId).map((participant) => {
    const run = participant.models[modelId];
    return {
      id: participant.id,
      name: participant.name,
      seconds: run.responseSeconds,
      decimals: run.responseDecimals,
      approximate: run.responseApproximate,
      accent: participant.accent,
    };
  });
}

export function memoryPanels(): MemoryPanel[] {
  return participants.map((participant) => {
    const small = memoryDelta(participant, "qwen35-0.8b");
    const large = memoryDelta(participant, "qwen35-4b");
    if (small.unit !== large.unit) {
      throw new Error(`Unidades de RAM divergentes para ${participant.name}.`);
    }
    return {
      id: participant.id,
      name: participant.name,
      unit: small.unit,
      accent: participant.accent,
      bars: [
        { label: modelById("qwen35-0.8b").shortLabel, value: small.value, decimals: small.decimals },
        { label: modelById("qwen35-4b").shortLabel, value: large.value, decimals: large.decimals },
      ],
    };
  });
}

function readingText(reading: GpuReading | undefined, absentLabel: string): string {
  if (!reading) {
    return absentLabel;
  }
  return formatGpu(reading);
}

function cpuText(participant: Participant, modelId: ModelId): string {
  const cpu = participant.models[modelId].cpu;
  const detail = formatCpuDetail(cpu);
  return detail ? `${formatCpu(cpu)} · ${detail}` : formatCpu(cpu);
}

export function resourceSeries(): ResourceSeries[] {
  const integrated = (modelId: ModelId) =>
    participants.map((participant) => {
      const gpu = participant.models[modelId].gpus.find((item) => item.role === "integrated");
      return gpu?.status === "measured" ? gpu.percent : null;
    });
  const dedicated = (modelId: ModelId) =>
    participants.map((participant) => {
      const gpu = participant.models[modelId].gpus.find((item) => item.role === "dedicated");
      return gpu?.status === "measured" ? gpu.percent : null;
    });
  const cpu = (modelId: ModelId) =>
    participants.map((participant) => {
      const reading = participant.models[modelId].cpu;
      return reading.kind === "unreported" ? null : reading.percent;
    });

  return [
    { name: "CPU · 0.8B", values: cpu("qwen35-0.8b") },
    { name: "CPU · 4B", values: cpu("qwen35-4b") },
    { name: "iGPU · 0.8B", values: integrated("qwen35-0.8b") },
    { name: "iGPU · 4B", values: integrated("qwen35-4b") },
    { name: "dGPU · 0.8B", values: dedicated("qwen35-0.8b") },
    { name: "dGPU · 4B", values: dedicated("qwen35-4b") },
  ];
}

export function resourceTable(): ResourceTableRow[] {
  const row = (label: string, cells: string[]): ResourceTableRow => ({ label, cells });

  return [
    row("CPU · 0.8B", participants.map((participant) => cpuText(participant, "qwen35-0.8b"))),
    row("CPU · 4B", participants.map((participant) => cpuText(participant, "qwen35-4b"))),
    row(
      "iGPU · 0.8B",
      participants.map((participant) =>
        readingText(
          participant.models["qwen35-0.8b"].gpus.find((item) => item.role === "integrated"),
          "—",
        ),
      ),
    ),
    row(
      "iGPU · 4B",
      participants.map((participant) =>
        readingText(
          participant.models["qwen35-4b"].gpus.find((item) => item.role === "integrated"),
          "—",
        ),
      ),
    ),
    row(
      "dGPU · 0.8B",
      participants.map((participant) =>
        readingText(
          participant.models["qwen35-0.8b"].gpus.find((item) => item.role === "dedicated"),
          "—",
        ),
      ),
    ),
    row(
      "dGPU · 4B",
      participants.map((participant) =>
        readingText(
          participant.models["qwen35-4b"].gpus.find((item) => item.role === "dedicated"),
          "—",
        ),
      ),
    ),
  ];
}

export function resourceColumns(): string[] {
  return participants.map((participant) => participant.name);
}
