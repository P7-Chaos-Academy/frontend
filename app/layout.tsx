import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

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
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
