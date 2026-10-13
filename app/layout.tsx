import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frontend Roadmap",
  description: "Frontend хөгжүүлэгч болох суралцах замын зураглал, явц хадгалагддаг",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body>{children}</body>
    </html>
  );
}
