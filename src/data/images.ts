import type { HardwareImage } from "./types.ts";

const cc0 = "https://creativecommons.org/publicdomain/zero/1.0/";
const ccBy = "https://creativecommons.org/licenses/by/4.0/";
const ccBySa = "https://creativecommons.org/licenses/by-sa/4.0/";

export const hardwareImages = {
  appleM1: {
    id: "apple-m1",
    file: "apple-m1.jpg",
    alt: "Processador Apple M1 ao lado de dois chips de memória",
    caption: "Apple M1",
    illustrative: false,
    author: "Henriok",
    license: "CC0",
    licenseUrl: cc0,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Apple_M1.jpg",
    width: 1173,
    height: 1400,
  },
  ryzen5700u: {
    id: "ryzen-5700u",
    file: "ryzen-5700u.jpg",
    alt: "AMD Ryzen 7 soldado em uma placa, com o die ao centro",
    caption: "Foto de um Ryzen 7 5700U. O modelo informado segue pendente.",
    illustrative: true,
    author: "Jawad.N.N",
    license: "CC BY-SA 4.0",
    licenseUrl: ccBySa,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Ryzen_5700U.jpg",
    width: 1400,
    height: 1050,
  },
  rtx3050: {
    id: "rtx-3050",
    file: "rtx-3050.jpg",
    alt: "Placa MSI GeForce RTX 3050 de desktop, vista frontal",
    caption: "RTX 3050 de desktop. O experimento usou a versão Laptop.",
    illustrative: true,
    author: "ITEagle Europe — Sebastiaan Broekhoven",
    license: "CC BY-SA 4.0",
    licenseUrl: ccBySa,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:MSI_GeForce_RTX_3050_Ventus_2X_E_6G_OC_-_front_view.jpg",
    width: 1400,
    height: 1399,
  },
  alderLakeDie: {
    id: "alder-lake-die",
    file: "alder-lake-die.jpg",
    alt: "Micrografia do die de um Intel Alder Lake desktop da série F, sem GPU integrada",
    caption: "Die Alder Lake série F, sem iGPU. O experimento usou o i3-1215U.",
    illustrative: true,
    author: "Fritzchens Fritz",
    license: "CC0",
    licenseUrl: cc0,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Intel@intel7(10nmESF)@AlderLake@ADL-S(6P%2B0E)@i5-12400F@SRL5Z_DSCx12_poly@20xDIC%2BLambda.jpg",
    width: 972,
    height: 1400,
  },
  ddr4: {
    id: "ddr4-sodimm",
    file: "ddr4-sodimm.jpg",
    alt: "Módulo SODIMM DDR4-3200 de 8 GB na embalagem",
    caption: "SODIMM DDR4 ilustrativo, não o pente de uma das máquinas.",
    illustrative: true,
    author: "Alexis Jazz",
    license: "CC BY 4.0",
    licenseUrl: ccBy,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Goodram_DDR4_8GB_3200MHz_CL22_SODIMM_module.jpg",
    width: 1200,
    height: 430,
  },
  nvme: {
    id: "nvme-ssd",
    file: "nvme-ssd.jpg",
    alt: "SSD NVMe M.2 sobre fundo claro",
    caption: "SSD NVMe ilustrativo, não o disco de uma das máquinas.",
    illustrative: true,
    author: "User5515",
    license: "CC0",
    licenseUrl: cc0,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:NVMe_SSd.jpg",
    width: 1200,
    height: 600,
  },
} as const satisfies Record<string, HardwareImage>;

export const imageCatalog: readonly HardwareImage[] = Object.values(hardwareImages);
