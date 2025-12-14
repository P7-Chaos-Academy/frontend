import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";
import { AuthProvider } from "@/contexts/AuthContext";
import { ClusterProvider } from "@/contexts/ClusterContext";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Strato Console",
  description: "Frontend for the Strato platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ fontFamily: "Roboto, sans-serif" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <ClusterProvider>{children}</ClusterProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
