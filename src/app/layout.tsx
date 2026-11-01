import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
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
