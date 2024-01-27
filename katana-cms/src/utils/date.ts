export function formatDateUnixToISO(stamp?: number | null): string {
  if (!stamp) return null;
  return new Date(stamp * 1000).toISOString();
}
