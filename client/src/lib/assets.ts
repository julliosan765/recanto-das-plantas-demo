/** Estufa Editorial: imagens já preparadas permanecem em uma origem pública estável, inclusive quando o site é exportado. */
const assetOrigin = "https://recantoplt-9svuvrks.manus.space";

export function storeAsset(filename: string) {
  return `${assetOrigin}/manus-storage/${filename}`;
}
