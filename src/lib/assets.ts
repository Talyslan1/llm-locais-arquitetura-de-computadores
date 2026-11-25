const imageFilePattern = /^[a-z0-9-]+\.(jpg|svg|webp)$/;

export function imageUrl(file: string): string {
  if (!imageFilePattern.test(file)) {
    throw new Error(`Nome de imagem inválido: ${file}`);
  }
  return `${import.meta.env.BASE_URL}images/${file}`;
}
