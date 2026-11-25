import { Cpu, Gpu, HardDrive, MemoryStick, Monitor } from "lucide";
import type { HardwareIcon } from "../data/types.ts";

const icons = {
  cpu: Cpu,
  gpu: Gpu,
  storage: HardDrive,
  ram: MemoryStick,
  os: Monitor,
} as const satisfies Record<HardwareIcon, readonly (readonly [string, Record<string, string | number | undefined>])[]>;

const allowedTags = new Set(["circle", "ellipse", "line", "path", "polygon", "polyline", "rect"]);

function isSafeAttribute(name: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(name) && name !== "href" && name !== "style" && !name.startsWith("on");
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderIcon(name: HardwareIcon, size = 22): string {
  const body = icons[name]
    .filter(([tag]) => allowedTags.has(tag))
    .map(([tag, attrs]) => {
      const rendered = Object.entries(attrs)
        .filter(([key, value]) => value !== undefined && isSafeAttribute(key))
        .map(([key, value]) => `${key}="${escapeAttribute(String(value))}"`)
        .join(" ");
      return `<${tag} ${rendered}/>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
