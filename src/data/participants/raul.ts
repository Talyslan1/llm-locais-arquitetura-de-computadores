import { hardwareImages } from "../images.ts";
import type { Participant } from "../types.ts";

const unreportedSwap = { reported: false } as const;

export const raul: Participant = {
  id: "raul",
  name: "Raul",
  accent: "violet",
  composition: "hero-left",
  emphasis: "dual-gpu",
  hardware: {
    cpu: "Intel Core i7-11800H",
    cpuConfirmation: "confirmed",
    cores: 8,
    ram: "16 GB",
    ramNote: "15,8 GB visíveis",
    storage: "SSD 512 GB",
    gpuSummary: "Intel Graphics e RTX 3050",
    os: "Windows 11",
  },
  image: hardwareImages.rtx2080,
  neutral: {
    ram: { used: { value: 7.4, unit: "GB", decimals: 1 }, total: { value: 15.8, unit: "GB", decimals: 1 } },
    cpu: { percent: 3, decimals: 0, kind: "average" },
    gpus: [
      { name: "Intel Graphics", role: "integrated", percent: 0, decimals: 0, status: "measured" },
      { name: "RTX 3050", role: "dedicated", percent: 0, decimals: 0, status: "measured" },
    ],
    swap: unreportedSwap,
  },
  models: {
    "qwen35-0.8b": {
      ram: { used: { value: 9.1, unit: "GB", decimals: 1 }, total: { value: 15.8, unit: "GB", decimals: 1 } },
      cpu: { percent: 15, decimals: 0, kind: "average" },
      gpus: [
        { name: "Intel Graphics", role: "integrated", percent: 15, decimals: 0, status: "measured" },
        { name: "RTX 3050", role: "dedicated", percent: 0, decimals: 0, status: "measured" },
      ],
      swap: unreportedSwap,
      responseSeconds: 3,
      responseDecimals: 0,
      responseApproximate: false,
    },
    "qwen35-4b": {
      ram: { used: { value: 11.5, unit: "GB", decimals: 1 }, total: { value: 15.8, unit: "GB", decimals: 1 } },
      cpu: { percent: 47, decimals: 0, kind: "average" },
      gpus: [
        { name: "Intel Graphics", role: "integrated", percent: 5, decimals: 0, status: "measured" },
        { name: "RTX 3050", role: "dedicated", percent: 35, decimals: 0, status: "measured" },
      ],
      swap: unreportedSwap,
      responseSeconds: 51,
      responseDecimals: 0,
      responseApproximate: false,
    },
  },
  observation: "No 0.8B só a Intel Graphics registrou uso. No 4B a RTX 3050 ficou em 35% e a integrada em 5%.",
};
