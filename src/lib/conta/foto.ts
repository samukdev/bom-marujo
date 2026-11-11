/** Recorta a imagem no centro (quadrado) e reduz para `lado` px: WebP (~10–30 KB), ou JPEG onde o navegador não gera WebP (Safari). */
export async function prepararFoto(arquivo: File, lado = 256): Promise<Blob> {
  const bitmap = await createImageBitmap(arquivo);
  const corte = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = lado;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Seu navegador não conseguiu processar a imagem.');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, (bitmap.width - corte) / 2, (bitmap.height - corte) / 2, corte, corte, 0, 0, lado, lado);
  bitmap.close();
  const gerar = (tipo: string) => new Promise<Blob | null>((ok) => canvas.toBlob(ok, tipo, 0.85));
  let blob = await gerar('image/webp');
  if (blob?.type !== 'image/webp') blob = await gerar('image/jpeg');
  if (!blob) throw new Error('Não deu para converter a imagem.');
  return blob;
}
