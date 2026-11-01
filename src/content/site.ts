// Facts on the page come from the résumé PDF. Never add the phone number, city, retail roles or
// student ID here (see CLAUDE.md).

export const person = {
  name: "David Dai",
  email: "daviddaicareer@gmail.com",
  linkedin: "https://www.linkedin.com/in/david-dai-974ab5313",
  github: "https://github.com/ddai0008",
  // The PDF is added to public/ by David; see the pull request notes.
  resume: "/David_Dai_Resume.pdf",
} as const;

export type Hue = "agencia" | "probudget" | "mymichlin" | "nutritrack";

export const navLinks = [
  { href: "#leadership", label: "Leadership" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export const selectedWork = [
  { href: "#leadership", label: "Agencia Change", hue: "agencia" },
  { href: "#probudget", label: "ProBudget", hue: "probudget" },
  { href: "#mymichlin", label: "MyMichlin", hue: "mymichlin" },
  { href: "#nutritrack", label: "NutriTrack", hue: "nutritrack" },
] as const satisfies readonly { href: string; label: string; hue: Hue }[];

export const team = [
  { role: "Developers", count: 2, note: "I am one of them" },
  { role: "Cyber security", count: 2 },
  { role: "Business analysts", count: 2 },
] as const;

export const impact = [
  {
    figure: "~30,000",
    caption: "donor records de-duplicated with a reusable Power Query fuzzy-matching pipeline",
  },
  {
    figure: "100%",
    caption: "precision on a random 100-record audit of the matches",
  },
  {
    figure: "1–2 h",
    caption: "of manual extract, clean and visualise work retired from every reporting round",
  },
  {
    figure: "1+ day",
    caption: "per manual identification pass replaced by automated flagging",
  },
] as const;

export const highDistinction = [
  "Mobile Application Development",
  "iOS Development",
  "Web Database Interfaces",
  "Object-Oriented Programming",
] as const;

export const skills = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Kotlin", "Swift", "Java", "PHP", "SQL"],
  },
  {
    label: "Web and real-time",
    items: ["Next.js", "React", "Tailwind", "CakePHP", "Yjs (CRDT)", "WebSocket", "REST", "Git", "Vercel"],
  },
  {
    label: "Mobile",
    items: ["Jetpack Compose", "Android SDK", "Room", "UIKit", "MVVM"],
  },
  {
    label: "Data and BI",
    items: ["PostgreSQL", "MySQL", "Power BI", "Power Query", "DAX", "Microsoft Dynamics", "Azure"],
  },
  {
    label: "Delivery",
    items: [
      "Agile and Scrum",
      "Requirements",
      "Stakeholder engagement",
      "Backlog and acceptance criteria",
      "Process mapping",
      "Documentation",
      "Lucidchart",
      "Figma",
    ],
  },
] as const;
