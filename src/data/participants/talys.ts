import { hardwareImages } from "../images.ts";
import type { Participant } from "../types.ts";

export const talys: Participant = {
  id: "talys",
  name: "Talys",
  accent: "blue",
  composition: "hero-top",
  emphasis: "integrated-gpu",
  hardware: {
    cpu: "AMD Ryzen 75000U",
    cpuConfirmation: "pending",
    cores: 16,
    ram: "16 GB",
    ramNote: "15 GiB visíveis",
    storage: "SSD 512 GB",
    gpuSummary: "Radeon integrada",
    os: "Bazzite",
  },
  image: hardwareImages.ryzen5700u,
  neutral: {
    ram: { used: { value: 4, unit: "GiB", decimals: 0 }, total: { value: 15, unit: "GiB", decimals: 0 } },
    cpu: { percent: 1, decimals: 0, kind: "average" },
    gpus: [{ name: "Radeon integrada", role: "integrated", percent: 0, decimals: 0, status: "measured" }],
    swap: { reported: true, quantity: { value: 0, unit: "B", decimals: 0 } },
  },
  models: {
    "qwen35-0.8b": {
      ram: { used: { value: 8.6, unit: "GiB", decimals: 1 }, total: { value: 15, unit: "GiB", decimals: 0 } },
      cpu: { percent: 10, decimals: 0, kind: "average" },
      gpus: [{ name: "Radeon integrada", role: "integrated", percent: 60, decimals: 0, status: "measured" }],
      swap: { reported: true, quantity: { value: 8, unit: "KiB", decimals: 1 } },
      responseSeconds: 7,
      responseDecimals: 0,
      responseApproximate: false,
    },
    "qwen35-4b": {
      ram: { used: { value: 11, unit: "GiB", decimals: 0 }, total: { value: 15, unit: "GiB", decimals: 0 } },
      cpu: { percent: 10, decimals: 0, kind: "average" },
      gpus: [{ name: "Radeon integrada", role: "integrated", percent: 96, decimals: 0, status: "measured" }],
      swap: { reported: true, quantity: { value: 211, unit: "MiB", decimals: 0 } },
      responseSeconds: 76,
      responseDecimals: 0,
      responseApproximate: false,
    },
  },
  observation:
    "A GPU integrada chegou a 96% no 4B. O tempo passou de 7 s para 76 s. O monitoramento não isola a causa.",
};
