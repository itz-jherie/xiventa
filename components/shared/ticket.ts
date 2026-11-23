/**
 * Ticket outlines used by the Event Card family in Figma: a rounded rectangle (radius 16) with a
 * 16 px notch (radius 8) cut into each side where the image meets the body.
 *
 * `inset` lets the same outline be used for a 1 px stroke that sits inside the edge, matching the
 * Figma `Border` (stroke inside) plus `Ticket Notch` (centre stroke) layers.
 */

/** Notches on the left and right edges at `ny` (vertical cards: Web, Compact). */
export function ticketPathV(w: number, h: number, ny: number, inset = 0, r = 16, n = 8): string {
  const i = inset;
  const R = r - i;
  return [
    `M ${r} ${i}`,
    `H ${w - r}`,
    `A ${R} ${R} 0 0 1 ${w - i} ${r}`,
    `V ${ny - n}`,
    `A ${n} ${n} 0 0 0 ${w - i} ${ny + n}`,
    `V ${h - r}`,
    `A ${R} ${R} 0 0 1 ${w - r} ${h - i}`,
    `H ${r}`,
    `A ${R} ${R} 0 0 1 ${i} ${h - r}`,
    `V ${ny + n}`,
    `A ${n} ${n} 0 0 0 ${i} ${ny - n}`,
    `V ${r}`,
    `A ${R} ${R} 0 0 1 ${r} ${i}`,
    "Z",
  ].join(" ");
}

/** Notches on the top and bottom edges at `nx` (horizontal List card). */
export function ticketPathH(w: number, h: number, nx: number, inset = 0, r = 16, n = 8): string {
  const i = inset;
  const R = r - i;
  return [
    `M ${r} ${i}`,
    `H ${nx - n}`,
    `A ${n} ${n} 0 0 0 ${nx + n} ${i}`,
    `H ${w - r}`,
    `A ${R} ${R} 0 0 1 ${w - i} ${r}`,
    `V ${h - r}`,
    `A ${R} ${R} 0 0 1 ${w - r} ${h - i}`,
    `H ${nx + n}`,
    `A ${n} ${n} 0 0 0 ${nx - n} ${h - i}`,
    `H ${r}`,
    `A ${R} ${R} 0 0 1 ${i} ${h - r}`,
    `V ${r}`,
    `A ${R} ${R} 0 0 1 ${r} ${i}`,
    "Z",
  ].join(" ");
}
