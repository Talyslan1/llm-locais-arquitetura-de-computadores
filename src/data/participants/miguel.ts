import { hardwareImages } from "../images.ts";
import type { Participant } from "../types.ts";

const noOffload = {
  name: "Intel UHD Graphics",
  role: "integrated" as const,
  percent: null,
  decimals: 0,
  status: "no-offload" as const,
};

export const miguel: Participant = {
  id: "miguel",
  name: "Miguel",
  accent: "amber",
  composition: "hero-left",
  emphasis: "ram-4b",
  hardware: {
    cpu: "Intel Core i3-1215U",
    cpuConfirmation: "confirmed",
    ram: "20 GB DDR4-3200",
    ramNote: "19 GiB visíveis",
    storage: "SSD NVMe",
    gpuSummary: "Intel UHD Graphics",
    os: "CachyOS",
  },
  image: hardwareImages.intelI9,
  neutral: {
    ram: { used: { value: 1.7, unit: "GiB", decimals: 1 }, total: { value: 19, unit: "GiB", decimals: 0 } },
    cpu: { percent: 2.4, decimals: 1, kind: "average" },
    gpus: [{ name: "Intel UHD Graphics", role: "integrated", percent: null, decimals: 0, status: "unreported" }],
    swap: { reported: true, quantity: { value: 692, unit: "KiB", decimals: 0 } },
  },
  models: {
    "qwen35-0.8b": {
      ram: { used: { value: 7.6, unit: "GiB", decimals: 1 }, total: { value: 19, unit: "GiB", decimals: 0 } },
      cpu: {
        percent: 24.5,
        decimals: 1,
        kind: "peak",
        duringGeneration: {
          min: { value: 7, decimals: 0 },
          max: { value: 11, decimals: 0 },
        },
      },
      gpus: [noOffload],
      swap: { reported: true, quantity: { value: 0, unit: "B", decimals: 0 } },
      responseSeconds: 25,
      responseDecimals: 0,
      responseApproximate: true,
    },
    "qwen35-4b": {
      ram: { used: { value: 15, unit: "GiB", decimals: 0 }, total: { value: 19, unit: "GiB", decimals: 0 } },
      cpu: {
        percent: 19,
        decimals: 0,
        kind: "peak",
        duringGeneration: {
          min: { value: 6, decimals: 0 },
          max: { value: 10.6, decimals: 1 },
        },
      },
      gpus: [noOffload],
      swap: { reported: true, quantity: { value: 158, unit: "MiB", decimals: 0 } },
      responseSeconds: 46,
      responseDecimals: 0,
      responseApproximate: true,
    },
  },
  observation: "Sem offload para a GPU. A RAM foi de 1,7 GiB no neutro para 15 GiB no 4B. Os tempos são aproximados.",
};
