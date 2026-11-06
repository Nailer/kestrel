// Fixed seats: each is an Otari end user with its own budget. Server-side allow-list so strangers
// cannot mint unlimited end users (and spend) by inventing seat ids.
export const SEATS = ["seat-judge", "seat-demo", "seat-guest"] as const;
export type Seat = (typeof SEATS)[number];
export const isSeat = (s: unknown): s is Seat => typeof s === "string" && (SEATS as readonly string[]).includes(s);
