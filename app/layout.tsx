import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./provider";
import Header from "./_components/Header";


export const metadata: Metadata = {
  title: "#",
  description: "AI Code Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
          <Provider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </Provider>
      </body>
    </html>
  );
}
