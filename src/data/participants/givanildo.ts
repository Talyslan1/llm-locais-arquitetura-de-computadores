import { hardwareImages } from "../images.ts";
import type { Participant } from "../types.ts";

export const givanildo: Participant = {
  id: "givanildo",
  name: "Givanildo",
  accent: "cyan",
  composition: "hero-left",
  emphasis: "fastest-4b",
  hardware: {
    cpu: "Apple M1",
    cpuConfirmation: "confirmed",
    cores: 8,
    ram: "8 GB",
    storage: "SSD 256 GB",
    gpuSummary: "GPU integrada do M1",
    os: "macOS",
  },
  image: hardwareImages.appleM1,
  neutral: {
    ram: { used: { value: 6.29, unit: "GB", decimals: 2 }, total: { value: 8, unit: "GB", decimals: 0 } },
    cpu: { percent: 9.57, decimals: 2, kind: "average" },
    gpus: [{ name: "Apple M1", role: "integrated", percent: 0, decimals: 0, status: "measured" }],
    swap: { reported: true, quantity: { value: 415.3, unit: "MB", decimals: 1 } },
  },
  models: {
    "qwen35-0.8b": {
      ram: { used: { value: 7.1, unit: "GB", decimals: 2 }, total: { value: 8, unit: "GB", decimals: 0 } },
      cpu: { percent: 55, decimals: 0, kind: "average" },
      gpus: [{ name: "Apple M1", role: "integrated", percent: 25, decimals: 0, status: "measured" }],
      swap: { reported: true, quantity: { value: 650, unit: "MB", decimals: 0 } },
      responseSeconds: 8.4,
      responseDecimals: 1,
      responseApproximate: false,
    },
    "qwen35-4b": {
      ram: { used: { value: 7.8, unit: "GB", decimals: 2 }, total: { value: 8, unit: "GB", decimals: 0 } },
      cpu: { percent: 78, decimals: 0, kind: "average" },
      gpus: [{ name: "Apple M1", role: "integrated", percent: 45, decimals: 0, status: "measured" }],
      swap: { reported: true, quantity: { value: 1.2, unit: "GB", decimals: 2 } },
      responseSeconds: 24.7,
      responseDecimals: 1,
      responseApproximate: false,
    },
  },
  observation: "Menor tempo observado no 4B neste experimento: 24,7 s. O swap cresceu até 1,20 GB.",
};
