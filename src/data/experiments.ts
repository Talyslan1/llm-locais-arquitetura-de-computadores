import { formatGpu, formatQuantity, formatSeconds, subtractQuantities } from "./format.ts";
import { requireValue } from "./guard.ts";
import { participants } from "./participants/index.ts";
import type { MemoryUnit, ModelId, Participant, Quantity } from "./types.ts";

export const prompt =
  "Explique, em português brasileiro, o que é arquitetura de computadores. Apresente uma definição, explique o papel da CPU, RAM e GPU e dê um exemplo prático de como esses componentes trabalham juntos para executar um programa. Seja objetivo e utilize no máximo 60 palavras.";

export const toolName = "LM Studio";

export const models = [
  { id: "qwen35-0.8b", label: "Qwen3.5-0.8B", shortLabel: "0.8B" },
  { id: "qwen35-4b", label: "Qwen3.5-4B", shortLabel: "4B" },
] as const satisfies readonly { id: ModelId; label: string; shortLabel: string }[];

export const methodSteps = [
  { index: "01", title: "Hardware", text: "Registrar CPU, RAM, disco, GPU e sistema." },
  { index: "02", title: "Estado neutro", text: "Anotar RAM, CPU e GPU antes da geração." },
  { index: "03", title: "Modelos", text: "Carregar o Qwen3.5-0.8B e, depois, o 4B." },
  { index: "04", title: "Mesmo prompt", text: "Enviar o texto idêntico em todas as máquinas." },
  { index: "05", title: "Monitor", text: "Observar o consumo durante a resposta." },
  { index: "06", title: "Tempo", text: "Cronometrar até o fim da geração." },
] as const;

export const limitations = [
  "Quantização não confirmada como idêntica.",
  "Sem três repetições.",
  "Tokens gerados não registrados.",
  "Configuração de inferência não confirmada.",
  "Monitores de sistema diferentes.",
  "Temperatura e energia não medidas de forma sistemática.",
] as const;

export const nextSteps = [
  "Três repetições.",
  "Tokens por segundo.",
  "Memória utilizada.",
  "Primeira abertura versus segunda abertura.",
  "Escada de tamanhos.",
] as const;

export const closingLine = "Hardware diferente. Comportamentos diferentes. O que realmente explica a diferença?";

export const memoryFootnote =
  "A diferença é o aumento do consumo reportado pelo sistema, não o tamanho dos pesos do modelo. GB e GiB não foram convertidos.";

export const resourceFootnote =
  "Percentuais vêm de monitores diferentes e não são medidas equivalentes. Pico, média e dado ausente estão marcados. Ausência não virou zero.";

const unitRank: Record<MemoryUnit, number> = {
  B: 0,
  KB: 1,
  KiB: 1,
  MB: 2,
  MiB: 2,
  GB: 3,
  GiB: 4,
};

export function modelById(modelId: ModelId) {
  return requireValue(
    models.find((model) => model.id === modelId),
    `Modelo desconhecido: ${modelId}`,
  );
}

export function memoryDelta(participant: Participant, modelId: ModelId): Quantity {
  return subtractQuantities(participant.models[modelId].ram.used, participant.neutral.ram.used);
}

export function extremeResponse(modelId: ModelId, direction: "min" | "max"): Participant {
  const ranked = [...participants].sort(
    (left, right) => left.models[modelId].responseSeconds - right.models[modelId].responseSeconds,
  );
  const picked = direction === "min" ? ranked[0] : ranked.at(-1);
  return requireValue(picked, "Não há participantes para comparar.");
}

export function largestReportedRamIncrease(): { participant: Participant; delta: Quantity } | null {
  const rows = participants.map((participant) => ({
    participant,
    delta: memoryDelta(participant, "qwen35-4b"),
  }));
  const top = rows.reduce((current, candidate) => (candidate.delta.value > current.delta.value ? candidate : current));
  const isUnambiguous = rows.every((row) => {
    if (row.participant.id === top.participant.id) {
      return true;
    }
    return top.delta.value > row.delta.value && unitRank[top.delta.unit] >= unitRank[row.delta.unit];
  });
  return isUnambiguous ? top : null;
}

export interface Finding {
  title: string;
  text: string;
}

export function findings(): Finding[] {
  const fastestSmall = extremeResponse("qwen35-0.8b", "min");
  const fastestLarge = extremeResponse("qwen35-4b", "min");
  const ramIncrease = largestReportedRamIncrease();
  const highIntegrated = participants.find((participant) => {
    const gpu = participant.models["qwen35-4b"].gpus.find((item) => item.role === "integrated");
    return gpu?.status === "measured" && gpu.percent !== null && gpu.percent >= 90;
  });
  const dedicatedShift = participants.find((participant) => {
    const small = participant.models["qwen35-0.8b"].gpus.find((item) => item.role === "dedicated");
    const large = participant.models["qwen35-4b"].gpus.find((item) => item.role === "dedicated");
    return small?.percent === 0 && large !== undefined && large.percent !== null && large.percent > 0;
  });

  const items: Finding[] = [
    {
      title: "0.8B",
      text: `${fastestSmall.name} registrou o menor tempo no 0.8B: ${formatSeconds(fastestSmall.models["qwen35-0.8b"])}.`,
    },
    {
      title: "4B",
      text: `${fastestLarge.name} registrou o menor tempo no 4B: ${formatSeconds(fastestLarge.models["qwen35-4b"])}.`,
    },
  ];

  if (ramIncrease) {
    items.push({
      title: "RAM",
      text: `${ramIncrease.participant.name} reportou o maior aumento de RAM no 4B: ${formatQuantity(ramIncrease.delta)}. As unidades originais foram preservadas.`,
    });
  }

  if (highIntegrated) {
    const gpu = requireValue(
      highIntegrated.models["qwen35-4b"].gpus.find((item) => item.role === "integrated"),
      "GPU integrada ausente.",
    );
    items.push({
      title: "GPU integrada",
      text: `${highIntegrated.name} chegou a ${formatGpu(gpu)} de GPU integrada no 4B.`,
    });
  }

  if (dedicatedShift) {
    const large = requireValue(
      dedicatedShift.models["qwen35-4b"].gpus.find((item) => item.role === "dedicated"),
      "GPU dedicada ausente.",
    );
    items.push({
      title: "GPU dedicada",
      text: `${dedicatedShift.name} manteve a ${large.name} em 0% no 0.8B e em ${formatGpu(large)} no 4B.`,
    });
  }

  return items;
}
