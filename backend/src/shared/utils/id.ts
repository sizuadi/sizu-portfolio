/**
 * ID Generator — menggunakan Bun's crypto
 */

export function generateId(prefix?: string): string {
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  return prefix ? `${prefix}-${random}` : random;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
