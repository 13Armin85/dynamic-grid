import "./globals.css";
import React from "react";

export const metadata = {
  title: "Reusable Data Grid",
  description: "Production-ready reusable data grid built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
