import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// The cross-platform face. Apple devices use SF Pro through -apple-system and never draw it; every
// other platform gets Inter instead of whatever the OS happens to ship (Segoe UI, Roboto,
// DejaVu), so the tight display tracking is tuned against one font rather than five. The
// optical-size axis switches large headings to Inter's tighter display cut.
const inter = Inter({ subsets: ["latin"], axes: ["opsz"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "David Dai — Software Engineer",
  description:
    "David Dai is a graduating Monash IT and Business student and software engineer who ships and leads. Résumé and selected projects.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Runs before first paint so a saved theme never flashes the wrong one. It sets the same
// data-theme attribute that ThemeToggle writes; with none saved the system scheme applies.
const applySavedTheme = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script above may set data-theme before React hydrates.
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: applySavedTheme }} />
      </head>
      <body className="min-h-full">
        <a href="#main" className="sr-only-focusable">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
