/** Sample ticket transfer links for PW24 Ticket claim (/t/<code>). `claimed` and unknown codes show the ended state. */
export interface TicketClaimLink {
  slug: string;
  from: string;
  tier: string;
  qty: number;
  expires: string;
}

export const CLAIM_CODES: Record<string, TicketClaimLink> = {
  tunde24: { slug: "abnormal-nightout", from: "Tunde", tier: "regular", qty: 1, expires: "Fri 24 Oct" },
};
