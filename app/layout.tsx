import type { ReactNode } from "react";

export const metadata = {
  title: "Enterprise AI Hiring Platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
