/**
 * Estufa Editorial: dados mínimos da loja, editáveis somente por administrador e usados em todos os caminhos de contato.
 */
export type StoreSettings = {
  whatsappNumber: string;
  instagramUrl: string;
  aboutSinceYear: number;
  aboutIntro: string;
  aboutDetail: string;
};

export const defaultStoreSettings: StoreSettings = {
  whatsappNumber: "558233287315",
  instagramUrl: "https://www.instagram.com/recantodasplantasal/",
  aboutSinceYear: 1999,
  aboutIntro: "Em Maceió, o Recanto reúne plantas, flores, vasos e itens para jardim, oferecendo qualidade e um atendimento próximo para quem quer cultivar, renovar ou presentear.",
  aboutDetail: "Fale com a equipe, consulte a disponibilidade e escolha com mais calma o que combina com o seu espaço.",
};

export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function makeWhatsAppUrl(number: string, message: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;
}
