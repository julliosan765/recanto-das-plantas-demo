/**
 * Estufa Editorial: dados mínimos da loja, editáveis somente por administrador e usados em todos os caminhos de contato.
 */
export type StoreSettings = {
  whatsappNumber: string;
  instagramUrl: string;
};

export const defaultStoreSettings: StoreSettings = {
  whatsappNumber: "558233287315",
  instagramUrl: "https://www.instagram.com/recantodasplantasal/",
};

export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function makeWhatsAppUrl(number: string, message: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;
}
