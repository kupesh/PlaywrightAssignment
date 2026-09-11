export function cents(text: string): number {
  const match = text.trim().match(/^\$?(\d+)\.(\d{2})$/);
  if (!match) throw new Error(`Invalid USD price: ${text}`);
  return Number(match[1]) * 100 + Number(match[2]);
}
