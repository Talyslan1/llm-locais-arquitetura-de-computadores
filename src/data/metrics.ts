import { formatCpu, formatCpuDetail, formatGpu, formatQuantity, formatSwap } from "./format.ts";
import type { MetricCell, MetricRow, Participant, PhaseSnapshot } from "./types.ts";

function cellFromCpu(snapshot: PhaseSnapshot): MetricCell {
  return { text: formatCpu(snapshot.cpu), detail: formatCpuDetail(snapshot.cpu) };
}

function snapshots(participant: Participant): PhaseSnapshot[] {
  return [participant.neutral, participant.models["qwen35-0.8b"], participant.models["qwen35-4b"]];
}

export function swapIsEntirelyUnreported(participant: Participant): boolean {
  return snapshots(participant).every((snapshot) => !snapshot.swap.reported);
}

export function metricRows(participant: Participant): MetricRow[] {
  const phases = snapshots(participant);
  const [neutral, small, large] = phases;
  if (!neutral || !small || !large) {
    throw new Error(`Fases incompletas para ${participant.name}.`);
  }

  const rows: MetricRow[] = [
    {
      label: "RAM",
      neutral: { text: formatQuantity(neutral.ram.used) },
      small: { text: formatQuantity(small.ram.used) },
      large: { text: formatQuantity(large.ram.used) },
    },
    {
      label: "CPU",
      neutral: cellFromCpu(neutral),
      small: cellFromCpu(small),
      large: cellFromCpu(large),
    },
  ];

  const gpuCount = neutral.gpus.length;
  if (small.gpus.length !== gpuCount || large.gpus.length !== gpuCount) {
    throw new Error(`Quantidade de GPUs divergente para ${participant.name}.`);
  }

  for (let index = 0; index < gpuCount; index += 1) {
    const neutralGpu = neutral.gpus[index];
    const smallGpu = small.gpus[index];
    const largeGpu = large.gpus[index];
    if (!neutralGpu || !smallGpu || !largeGpu) {
      throw new Error(`GPU ausente para ${participant.name}.`);
    }
    rows.push({
      label: neutralGpu.name,
      neutral: { text: formatGpu(neutralGpu) },
      small: { text: formatGpu(smallGpu) },
      large: { text: formatGpu(largeGpu) },
    });
  }

  if (!swapIsEntirelyUnreported(participant)) {
    rows.push({
      label: "Swap",
      neutral: { text: formatSwap(neutral.swap) },
      small: { text: formatSwap(small.swap) },
      large: { text: formatSwap(large.swap) },
    });
  }

  return rows;
}
