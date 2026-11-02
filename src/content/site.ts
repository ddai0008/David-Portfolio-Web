// Facts on the page come from the résumé PDF. Never add the phone number, city, retail roles or
// student ID here (see CLAUDE.md).

// The live ProBudget demo, used by the hero caption and the project section.
export const proBudgetDemo = "https://pro-budget.vercel.app";

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

// Results land after the final exams, so update these when they do.
export const academics = { gpa: "3.70", wam: "82.1" } as const;

// What a recruiter wants in the first ten seconds, under the hero.
export const glance = [
  { figure: academics.gpa, caption: `GPA out of 4.0, WAM ${academics.wam}` },
  { figure: "6", caption: "people led as capstone Team Lead" },
  { figure: "~30,000", caption: "donor records de-duplicated at St Vincent de Paul" },
  { figure: "DP-900", caption: "Microsoft Azure Data Fundamentals" },
] as const;

export const impact = [
  {
    figure: "~30,000",
    count: { to: 30000, prefix: "~" },
    caption: "donor records de-duplicated with a reusable Power Query fuzzy-matching pipeline",
  },
  {
    figure: "100/100",
    spoken: "100 of 100",
    caption: "matches correct in a random audit sample",
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

// How the de-duplication ran, using only what the résumé says about it.
export const matchingFlow = [
  { label: "Collect", text: "About 30,000 donor records" },
  { label: "Match", text: "A reusable Power Query fuzzy-matching pipeline for near-duplicates" },
  { label: "Flag", text: "Likely duplicates flagged automatically" },
  { label: "Review", text: "Human review for the final merge decision" },
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

export type Evidence = "probudget" | "mymichlin" | "nutritrack" | "agencia" | "stvincent";

// The places a skill is shown in use. The St Vincent internship has no project colour, so it
// stays neutral rather than borrowing one.
export const evidence = [
  { id: "probudget", label: "ProBudget", hue: "probudget" },
  { id: "mymichlin", label: "MyMichlin", hue: "mymichlin" },
  { id: "nutritrack", label: "NutriTrack", hue: "nutritrack" },
  { id: "agencia", label: "Agencia capstone", hue: "agencia" },
  { id: "stvincent", label: "St Vincent", hue: null },
] as const satisfies readonly { id: Evidence; label: string; hue: Hue | null }[];

// Which projects each skill appears in, using only what the page already says about them: the
// stack lines and details sheets, and the capstone and internship copy. A skill with no entry is
// on the résumé but not evidenced here, so it stays plain rather than being linked on a guess.
export const skillEvidence: Readonly<Record<string, readonly Evidence[]>> = {
  TypeScript: ["probudget"],
  "Next.js": ["probudget"],
  React: ["probudget"],
  Tailwind: ["probudget"],
  Vercel: ["probudget"],
  PostgreSQL: ["probudget"],
  Azure: ["probudget"],
  Swift: ["mymichlin"],
  UIKit: ["mymichlin"],
  Kotlin: ["nutritrack"],
  "Jetpack Compose": ["nutritrack"],
  Room: ["nutritrack"],
  MVVM: ["nutritrack"],
  Figma: ["nutritrack"],
  CakePHP: ["agencia"],
  MySQL: ["agencia"],
  "Yjs (CRDT)": ["agencia"],
  WebSocket: ["agencia"],
  "Agile and Scrum": ["agencia"],
  "Stakeholder engagement": ["agencia"],
  "Backlog and acceptance criteria": ["agencia"],
  Requirements: ["agencia", "stvincent"],
  Documentation: ["agencia", "stvincent"],
  "Power BI": ["stvincent"],
  "Power Query": ["stvincent"],
  "Microsoft Dynamics": ["stvincent"],
};
