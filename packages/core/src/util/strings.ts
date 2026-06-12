/** Derives a human-readable label from a property name, e.g. `firstName` → `First Name`. */
export const humanizeName = (name: string): string =>
  name
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
