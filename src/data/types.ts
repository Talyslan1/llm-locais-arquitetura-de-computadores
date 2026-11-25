export type MemoryUnit = "B" | "KiB" | "MiB" | "GiB" | "KB" | "MB" | "GB";

export type ModelId = "qwen35-0.8b" | "qwen35-4b";

export type Accent = "blue" | "cyan" | "violet" | "amber";

export type HardwareIcon = "cpu" | "ram" | "gpu" | "storage" | "os";

export interface MeasuredNumber {
  value: number;
  decimals: number;
}

export interface Quantity extends MeasuredNumber {
  unit: MemoryUnit;
}

export interface CpuReading {
  percent: number | null;
  decimals: number;
  kind: "average" | "peak" | "unreported";
  duringGeneration?: {
    min: MeasuredNumber;
    max: MeasuredNumber;
  };
}

export type GpuStatus = "measured" | "unreported" | "no-offload";

export interface GpuReading {
  name: string;
  role: "integrated" | "dedicated";
  percent: number | null;
  decimals: number;
  status: GpuStatus;
}

export type SwapReading =
  | { reported: false }
  | { reported: true; quantity: Quantity };

export interface MemoryReading {
  used: Quantity;
  total?: Quantity;
}

export interface PhaseSnapshot {
  ram: MemoryReading;
  cpu: CpuReading;
  gpus: readonly GpuReading[];
  swap: SwapReading;
}

export interface ModelRun extends PhaseSnapshot {
  responseSeconds: number;
  responseDecimals: number;
  responseApproximate: boolean;
}

export interface HardwareImage {
  id: string;
  file: string;
  alt: string;
  caption: string;
  illustrative: boolean;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  width: number;
  height: number;
}

export interface HardwareProfile {
  cpu: string;
  cpuConfirmation: "pending" | "confirmed";
  cores?: number;
  ram: string;
  ramNote?: string;
  storage: string;
  gpuSummary: string;
  os: string;
}

export interface Participant {
  id: string;
  name: string;
  accent: Accent;
  composition: "hero-left" | "hero-top";
  emphasis: "integrated-gpu" | "fastest-4b" | "dual-gpu" | "ram-4b";
  hardware: HardwareProfile;
  image: HardwareImage;
  neutral: PhaseSnapshot;
  models: Record<ModelId, ModelRun>;
  observation: string;
}

export interface HardwareFact {
  icon: HardwareIcon;
  label: string;
  value: string;
}

export interface MetricCell {
  text: string;
  detail?: string;
}

export interface MetricRow {
  label: string;
  neutral: MetricCell;
  small: MetricCell;
  large: MetricCell;
}
