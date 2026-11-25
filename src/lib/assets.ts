const imageFilePattern = /^[a-z0-9-]+\.(jpg|svg|webp)$/;

function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path}`;
}

export function imageUrl(file: string): string {
  if (!imageFilePattern.test(file)) {
    throw new Error(`Nome de imagem inválido: ${file}`);
  }
  return withBase(`images/${file}`);
}

export function assetUrl(file: string): string {
  if (!imageFilePattern.test(file)) {
    throw new Error(`Nome de imagem inválido: ${file}`);
  }
  return withBase(file);
}
