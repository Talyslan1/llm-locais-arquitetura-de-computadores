import { existsSync } from "node:fs";
import { memoryDelta } from "../src/data/experiments.ts";
import { imageCatalog } from "../src/data/images.ts";
import { findings, largestReportedRamIncrease } from "../src/data/experiments.ts";
import { participants } from "../src/data/participants/index.ts";
import type { ModelId, Quantity } from "../src/data/types.ts";

interface ExpectedTime {
  id: string;
  model: ModelId;
  seconds: number;
}

interface ExpectedDelta {
  id: string;
  model: ModelId;
  value: number;
  unit: Quantity["unit"];
}

const expectedTimes: readonly ExpectedTime[] = [
  { id: "talys", model: "qwen35-0.8b", seconds: 7 },
  { id: "talys", model: "qwen35-4b", seconds: 76 },
  { id: "givanildo", model: "qwen35-0.8b", seconds: 8.4 },
  { id: "givanildo", model: "qwen35-4b", seconds: 24.7 },
  { id: "raul", model: "qwen35-0.8b", seconds: 3 },
  { id: "raul", model: "qwen35-4b", seconds: 51 },
  { id: "miguel", model: "qwen35-0.8b", seconds: 25 },
  { id: "miguel", model: "qwen35-4b", seconds: 46 },
];

const expectedDeltas: readonly ExpectedDelta[] = [
  { id: "talys", model: "qwen35-0.8b", value: 4.6, unit: "GiB" },
  { id: "talys", model: "qwen35-4b", value: 7, unit: "GiB" },
  { id: "givanildo", model: "qwen35-0.8b", value: 0.81, unit: "GB" },
  { id: "givanildo", model: "qwen35-4b", value: 1.51, unit: "GB" },
  { id: "raul", model: "qwen35-0.8b", value: 1.7, unit: "GB" },
  { id: "raul", model: "qwen35-4b", value: 4.1, unit: "GB" },
  { id: "miguel", model: "qwen35-0.8b", value: 5.9, unit: "GiB" },
  { id: "miguel", model: "qwen35-4b", value: 13.3, unit: "GiB" },
];

const errors: string[] = [];

function fail(message: string): void {
  errors.push(message);
}

const talys = participants.find((participant) => participant.id === "talys");
if (!talys || talys.hardware.cpu !== "AMD Ryzen 75000U" || talys.hardware.cpuConfirmation !== "pending") {
  fail("A CPU de Talys precisa permanecer como informada e pendente.");
}

const miguel = participants.find((participant) => participant.id === "miguel");
const miguelGpu = miguel?.models["qwen35-4b"].gpus[0];
if (!miguelGpu || miguelGpu.percent !== null || miguelGpu.status !== "no-offload") {
  fail("A GPU de Miguel não pode ser convertida em zero.");
}

for (const expected of expectedTimes) {
  const participant = participants.find((item) => item.id === expected.id);
  const actual = participant?.models[expected.model].responseSeconds;
  if (actual !== expected.seconds) {
    fail(`${expected.id} ${expected.model}: tempo ${String(actual)} em vez de ${expected.seconds}.`);
  }
}

for (const expected of expectedDeltas) {
  const participant = participants.find((item) => item.id === expected.id);
  if (!participant) {
    fail(`Participante ausente: ${expected.id}`);
    continue;
  }
  const delta = memoryDelta(participant, expected.model);
  if (delta.value !== expected.value || delta.unit !== expected.unit) {
    fail(`${expected.id} ${expected.model}: delta ${delta.value} ${delta.unit} em vez de ${expected.value} ${expected.unit}.`);
  }
}

const increase = largestReportedRamIncrease();
if (increase?.participant.id !== "miguel") {
  fail("O maior aumento inequívoco de RAM no 4B deveria ser o de Miguel.");
}

const texts = findings().map((item) => item.text).join(" ");
if (!texts.includes("Raul") || !texts.includes("Givanildo") || !texts.includes("Miguel") || !texts.includes("Talys")) {
  fail("As observações cruzadas deixaram de citar os quatro resultados previstos.");
}

if (talys && (!talys.image.illustrative || !talys.image.caption.includes("Ryzen 5 2600") || !talys.image.caption.includes("75000U"))) {
  fail("A foto de Talys precisa ser ilustrativa e dizer que é um Ryzen 5 2600, não o modelo informado.");
}

const raul = participants.find((participant) => participant.id === "raul");
if (!raul?.image.illustrative || !raul.image.caption.includes("RTX 3050 Laptop")) {
  fail("A foto de Raul precisa avisar que não é a RTX 3050 Laptop.");
}

if (!miguel?.image.illustrative || !miguel.image.caption.includes("i9-9900K") || !miguel.image.caption.includes("i3-1215U")) {
  fail("A foto de Miguel precisa ser o i9-9900K ilustrativo, não o i3-1215U.");
}
if (miguel && (miguel.image.file.includes("alder") || miguel.image.caption.toLowerCase().includes("die"))) {
  fail("A foto de Miguel não pode voltar a ser a micrografia do die.");
}

const givanildo = participants.find((participant) => participant.id === "givanildo");
if (givanildo?.image.file !== "apple-m1.jpg" || givanildo.image.license !== "CC0") {
  fail("A foto de Givanildo precisa continuar sendo o Apple M1 em CC0.");
}

for (const image of imageCatalog) {
  if (!existsSync(new URL(`../public/images/${image.file}`, import.meta.url))) {
    fail(`Imagem ausente: ${image.file}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Dados conferidos: ${participants.length} participantes, ${imageCatalog.length} imagens.`);
