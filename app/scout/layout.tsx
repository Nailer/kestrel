import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New scout · Kestrel",
  description: "Paste a hackathon or bounty link and get a verified go / maybe / no-go brief.",
};

export default function ScoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
