import type { HardwareFact, HardwareProfile } from "./types.ts";

export function listHardwareFacts(hardware: HardwareProfile): HardwareFact[] {
  const cpu = hardware.cores === undefined ? hardware.cpu : `${hardware.cpu} · ${hardware.cores} núcleos`;
  const ram = hardware.ramNote === undefined ? hardware.ram : `${hardware.ram} · ${hardware.ramNote}`;

  return [
    { icon: "cpu", label: "CPU", value: cpu },
    { icon: "ram", label: "RAM", value: ram },
    { icon: "gpu", label: "GPU", value: hardware.gpuSummary },
    { icon: "storage", label: "Disco", value: hardware.storage },
    { icon: "os", label: "Sistema", value: hardware.os },
  ];
}
