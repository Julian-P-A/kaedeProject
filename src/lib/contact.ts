/** Public contact details, shared by visible content and structured data. */
export const CONTACT_PHONE = '+57 315 188 3229'
export const WHATSAPP_URL = 'https://wa.me/573151883229'

export function whatsappUrl(message: string): string {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`
}
