export type Project = {
  slug: string;
  published?: boolean;
  title: string;
  eyebrow: string;
  summary: string;
  image: string;
  tags: string[];
  role: string;
  team: string;
  timeline: string;
  projectType: string;
  challenge: string;
  approach: string[];
  results: string[];
  liveUrl?: string;
  githubUrl?: string;
  gallery?: string[];
  youtubeVideoId?: string;
  imageKind?: "logo";
  achievement?: string;
  availabilityNote?: string;
  buildStory?: string;
};

export type CertificationCategory =
  | "Data & Analytics"
  | "Artificial Intelligence"
  | "Cloud & Development"
  | "Software & Tools"
  | "Hackathons & Events";

export type Certification = {
  slug: string;
  title: string;
  issuer: string;
  category: CertificationCategory;
  image: string;
  year?: string;
  description: string;
};

const projectAsset = (name: string) => `/assets/projects/${name}`;
const certAsset = (name: string) => `/assets/certs/${name}`;
const experienceAsset = (name: string) => `/assets/experiences/${name}`;

export const projectOrder = [
  "wave-and-wish",
  "duely",
  "csiteach",
  "icslink",
  "orbitiq",
  "augustinian-developer-society-website",
  "praise-and-pray",
  "pusa-run",
  "iloilo-farmers-hub",
  "e-serbisyo-rizal",
];

export const projects: Project[] = [
  {
    slug: "pusa-run",
    title: "pUSA Run",
    eyebrow: "Body-Controlled Endless Runner",
    summary:
      "I handled game programming and computer vision for our four-person team's campus-inspired endless runner, guiding Pipin through Rada Hall with body movement or keyboard controls.",
    image: projectAsset("pusa-run/01-main-menu.webp"),
    gallery: [
      projectAsset("pusa-run/02-settings.webp"),
    ],
    tags: ["Python", "Pygame", "OpenCV", "MediaPipe", "NumPy"],
    role: "Game Developer & Computer Vision Engineer",
    team: "4-person Academic Team",
    timeline: "2026 · Semester project in development",
    projectType: "Academic Game Development Project",
    availabilityNote: "pUSA Run is a Windows desktop game. A browser demo isn't available.",
    buildStory:
      "I worked as the developer in a four-person academic team, alongside teammates responsible for project management, design, and QA and sound engineering. Our game takes inspiration from the University of San Agustin campus, following Pipin, a campus cat, as he escapes a rat through Rada Hall. I handled all programming except sound implementation. Our design document plans development across one academic semester.",
    challenge:
      "Our team wanted to turn a familiar campus setting and Pipin's chase into a playful, motion-controlled runner. My challenge was to translate the team's concept and visual assets into responsive three-lane gameplay, with keyboard controls available when a webcam or suitable tracking setup isn't available.",
    approach: [
      "I handled all programming except sound implementation, including the Pygame interface, game logic, and computer vision controls.",
      "I used OpenCV and MediaPipe to track upper-body landmarks, calibrate the player's position, and translate movement into lane changes and jumps.",
      "I implemented keyboard controls, guided tutorials, camera settings, pause and restart flows, and local preferences.",
      "I kept camera-frame processing in memory without saving webcam footage.",
    ],
    results: [
      "Our team created a campus-inspired runner set in Rada Hall at the University of San Agustin",
      "I programmed the game systems and computer vision controls, while my teammates contributed project management, design, QA, and sound implementation",
      "I provided body-controlled play and a keyboard-only option",
      "I added calibration, tutorial instructions, and configurable camera settings",
    ],
  },
  {
    slug: "csiteach",
    title: "CSITeach",
    eyebrow: "Student Mentoring Platform",
    summary:
      "I supported junior developers through QA, backend architecture guidance, and targeted backend contributions to Holotech Society's student mentoring platform.",
    image: projectAsset("csiteach/cover.webp"),
    gallery: Array.from({ length: 21 }, (_, index) => projectAsset(`csiteach/screen-${String(index + 1).padStart(2, "0")}.webp`)),
    liveUrl: "https://csiteach.vercel.app/",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase"],
    role: "QA & Technical Mentor",
    team: "Holotech Society · Junior-led development team",
    timeline: "2026",
    projectType: "Student Mentoring Platform",
    challenge:
      "My role was to help a junior development team build a structured mentoring platform that brings mentor applications, topic review, mentee matching, session records, and program oversight into one consistent experience.",
    approach: [
      "I mentored the junior developers on backend architecture and how to structure the platform's backend workflows.",
      "I focused primarily on quality assurance, helping review the system and its mentor, mentee, and administrator experiences.",
      "I made limited backend coding contributions while the junior developers implemented most of the platform.",
    ],
    results: [
      "I supported a junior-led mentoring platform through QA and technical guidance",
      "Our platform brings together workflows for mentors, mentees, and program administrators",
      "Our project screenshots show topic management, matching, session logs, reports, and program oversight",
    ],
  },
  {
    slug: "orbitiq",
    title: "OrbitIQ",
    eyebrow: "2nd Runner-Up · RELX AI Summit Hackathon",
    summary:
      "I led the backend and AI workflow for an invoice review system that detects exceptions, gathers evidence, and supports finance analysts with explainable recommendations.",
    image: projectAsset("orbitiq-logo.webp"),
    gallery: [
      projectAsset("orbitiq/award-certificate.webp"),
      projectAsset("orbitiq/hackathon-presentation.webp"),
      projectAsset("orbitiq/hackathon-team.webp"),
      projectAsset("orbitiq/hackathon-awards.webp"),
      projectAsset("orbitiq/hackathon-group.webp"),
    ],
    imageKind: "logo",
    achievement: "2nd Runner-Up · RELX AI Summit Academe Hackathon 2026",
    availabilityNote: "I can't share a public demo due to restrictions on the hackathon-provided dataset.",
    buildStory:
      "I built OrbitIQ with Team WeUseDockers during an approximately five-hour hackathon sprint. We worked from the provided financial dataset to a functioning end-to-end prototype, getting the complete workflow running in the final minutes before the demo. We went on to place 2nd Runner-Up.",
    tags: ["React", "TypeScript", "Python", "FastAPI", "Claude", "AWS Bedrock", "pandas", "SQLite"],
    role: "Fullstack Developer / Backend & AI Lead",
    team: "WeUseDockers · 3-person team",
    timeline: "October 9, 2026 · Approximately 5-hour sprint",
    projectType: "RELX / Reed Elsevier Philippines AI Summit Academe Hackathon",
    challenge:
      "We set out to help finance teams review problematic invoices faster by bringing together purchase orders, supplier records, previous invoices, payments, and existing exceptions. I focused on detecting missing POs, amount mismatches, duplicates, and other inconsistencies while keeping the final financial decision with a human analyst.",
    approach: [
      "I led the FastAPI backend and AI workflow, processing the supplied CSV-based finance datasets with pandas and SQLite.",
      "I implemented invoice validation and rule-based financial checks, including PO mismatches and duplicate invoice detection.",
      "I integrated Claude through AWS Bedrock to explain cases, organize supporting evidence, and recommend a next action.",
      "I implemented safety controls so AI recommendations could not bypass financial checks or the analyst's final decision.",
      "I connected the backend workflow with the React and TypeScript frontend, and helped test and prepare the prototype for the live demo.",
    ],
    results: [
      "We placed 2nd Runner-Up at the RELX / Reed Elsevier Philippines AI Summit Academe Hackathon",
      "We built a functioning end-to-end prototype in approximately five hours",
      "I structured the AI workflow around explainable recommendations and human-controlled financial decisions",
      "My team, WeUseDockers: Rey Jane Andrada, Christian M. Lañada, and Christian Joseph F. Ortigas",
      "We were mentored by Diego Paul Lee Tian",
    ],
  },
  {
    slug: "augustinian-developer-society-website",
    published: false,
    title: "Augustinian Developer Society Website",
    eyebrow: "Organization Website",
    summary:
      "I led frontend development and design implementation for ADS USA's official responsive website, bringing its story, initiatives, events, departments, team, and partners into a Sanity-managed experience.",
    image: projectAsset("ads-website-2026.webp"),
    githubUrl: "https://github.com/randrada-usa/ADS_website_2026",
    tags: ["Next.js 16", "React 19", "TypeScript", "Sanity", "GSAP", "styled-components"],
    role: "Web Development Lead",
    team: "Augustinian Developer Society · 4-person development team",
    timeline: "Aug 30, 2026–Present · Awaiting launch",
    projectType: "Official Organization Website",
    challenge:
      "I needed to translate a highly animated visual direction into a clear, accessible organization website that remains consistent across desktop, tablet, and mobile while giving our team a maintainable way to manage evolving content.",
    approach: [
      "I led frontend and design implementation across the homepage, navigation, organization story, initiatives, events, departments, team profiles, partners, FAQs, and shared site structure.",
      "I built reusable GSAP animation patterns with viewport-triggered playback and reduced-motion support so movement enhances the experience without obscuring content or compromising accessibility.",
      "I created breakpoint-specific responsive layouts and interaction refinements for desktop, tablet, and mobile, including adaptable navigation and content presentation.",
      "I integrated Sanity CMS, Portable Text, embedded Studio, and draft preview workflows to let the organization maintain structured content beyond the initial launch.",
    ],
    results: [
      "I unified the organization's public story, initiatives, events, departments, members, and partners in one responsive experience",
      "I established a reusable content system for ongoing updates through Sanity CMS",
      "I delivered responsive behavior across desktop, tablet, and mobile layouts",
      "I included reduced-motion behavior and accessibility-conscious animation patterns",
      "I prepared the website for final content review, sign-off, and public launch",
    ],
  },
  {
    slug: "duely",
    title: "Duely",
    youtubeVideoId: "HDtbj-mOPM8",
    eyebrow: "AI Student Task Organizer",
    summary:
      "I founded and led a three-person team building an Android-first student organizer that turns assignment photos into editable tasks through on-device OCR and optional AI assistance.",
    image: projectAsset("duely/cover-logo-v2.webp"),
    imageKind: "logo",
    gallery: [
      projectAsset("duely/01-duely-overview.webp"),
      projectAsset("duely/02-scan-with-ocr-or-ai-assist.webp"),
      projectAsset("duely/03-review-and-organize-tasks.webp"),
      projectAsset("duely/04-calendar-deadlines-and-reminders.webp"),
      projectAsset("duely/05-duely-plus-revenuecat-test-store.webp"),
      projectAsset("duely/06-guided-student-onboarding.webp"),
      projectAsset("duely/07-clear-permission-choices.webp"),
      projectAsset("duely/08-google-sign-in-or-guest.webp"),
      projectAsset("duely/09-home-and-next-actions.webp"),
      projectAsset("duely/10-task-search-filters-and-empty-state.webp"),
      projectAsset("duely/11-profile-reminders-and-backup.webp"),
      projectAsset("duely/12-branded-dialogs-and-safe-actions.webp"),
    ],
    tags: ["React Native", "Expo", "TypeScript", "Supabase", "Google ML Kit", "Gemini", "RevenueCat"],
    role: "Founder, Product & Technical Lead",
    team: "Independent Product · 3-person team",
    timeline: "Aug 2026–Present · Active beta",
    projectType: "Independent Mobile Product",
    challenge:
      "I wanted to make it easier for students to turn handouts, screenshots, and photos into organized tasks without hiding OCR mistakes or sending every assignment image to the cloud.",
    approach: [
      "I built the Android app with React Native, Expo Router, and TypeScript, including offline tasks, reminders, smart prioritization, calendar views, and local source-image retention.",
      "I designed an on-device Google ML Kit OCR flow that shows uncertainty per field and requires an editable review before a task is saved.",
      "I added optional Gemini-assisted extraction through an authenticated Supabase Edge Function with explicit consent, monthly limits, cancellation recovery, timeouts, and local OCR fallback.",
      "I implemented Google sign-in, Row Level Security, cloud backup and restore, accessibility improvements, and a RevenueCat Test Store flow for simulated Duely Plus purchases.",
    ],
    results: [
      "Our test suite passed 320 automated tests across 62 test files",
      "Our parser evaluation covered 24 English, Filipino, and mixed-language cases",
      "Our controlled 12-image synthetic OCR pack achieved 99.5% token accuracy",
      "Our controlled scans produced parser-ready text in 12/12 cases",
      "Our evaluation extracted 6/6 clear deadlines, avoided 3/3 missing deadlines, and flagged 3/3 ambiguous deadlines",
      "We verified the Android demo for OCR, optional AI review, task saving, and simulated Plus purchase and restore",
    ],
  },
  {
    slug: "icslink",
    title: "ICSLink",
    eyebrow: "Event Management Platform",
    summary:
      "I led a three-person team through a two-week sprint to build an internal event platform that unifies discovery, registration, QR ticketing, attendance, and reporting for the Institute of Computer Science.",
    image: projectAsset("icslink.webp"),
    liveUrl: "https://icslink.pages.dev/",
    tags: ["React 19", "TypeScript", "Supabase", "Cloudflare Pages"],
    role: "Development Lead",
    team: "Institute of Computer Science · 3-person team",
    timeline: "2-week sprint · September 2026",
    projectType: "Internal Organization Project",
    challenge:
      "We needed to replace disconnected event forms, paper attendance sheets, and manually maintained spreadsheets with one responsive system for students, guests, and organizers—without sacrificing access control or attendance integrity.",
    approach: [
      "I led the architecture and implementation of a React 19 and TypeScript interface backed by Supabase PostgreSQL, Google OAuth, role-based access, Edge Functions, and Storage.",
      "I built event management, registration, QR ticket generation, attendance scanning, duplicate prevention, check-in and checkout flows, and exportable reporting.",
      "I coordinated the three-person team, reviewed contributions before merge, and established continuous integration with 75 automated tests plus 44 Playwright desktop and mobile browser scenarios.",
    ],
    results: [
      "We supported 22 attendees in our first live workshop",
      "Our platform processed 44 check-in and checkout scans",
      "We had 4 additional workshops scheduled",
      "We projected 100+ attendee visits across the workshop series",
      "I designed the platform for 150 potential organization members",
      "Our checks included 75 automated tests and 44 Playwright browser scenarios",
    ],
  },
  {
    slug: "wave-and-wish",
    title: "Wave & Wish",
    eyebrow: "Computer Vision Game",
    summary:
      "I led a six-person team to deliver a touchless festival game in seven days. We served 280+ players with zero crashes.",
    image: projectAsset("wave-and-wish.webp"),
    gallery: Array.from({ length: 11 }, (_, index) => projectAsset(`wave-and-wish/photo-${String(index + 1).padStart(2, "0")}.webp`)),
    tags: ["Python", "Pygame", "OpenCV", "MediaPipe"],
    role: "Development Lead & Overall Team Lead",
    team: "6-BYTE Studios · 6-person team",
    timeline: "7-day build · Capiztahan 2026",
    projectType: "Commisioned Festival Game",
    challenge:
      "We needed to build a camera-controlled festival game that could survive a seven-hour public event, difficult lighting, rapid player turnover, and a fixed physical-prize inventory.",
    approach: [
      "I mapped MediaPipe palm landmarks to screen coordinates with exponential smoothing, a deadzone, and position prediction for brief tracking loss.",
      "I designed a dynamic difficulty system, anti-streak spawn rules, three fully themed content sets, and an event-driven mascot HUD.",
      "I built an auditable gacha system with configurable win rates, multiple wishes, unique claim codes, and JSONL result logging.",
      "I packaged the Python application for Windows with a custom PyInstaller specification covering MediaPipe models and OpenCV dependencies.",
    ],
    results: [
      "We delivered an event-ready game in seven days",
      "We served 280+ players in seven hours",
      "We distributed 170 physical prizes",
      "Our game ran with 0 crashes during the event",
    ],
  },
  {
    slug: "praise-and-pray",
    title: "Praise & Pray",
    eyebrow: "Gesture-Controlled Church Game",
    summary:
      "I led a six-person team to deliver a commissioned gesture-controlled game for Estancia Baptist Church in three weeks. Our game served approximately 20–40 participants per weekend day.",
    image: projectAsset("praise-and-pray.webp"),
    tags: ["Python", "Pygame", "OpenCV", "MediaPipe"],
    role: "Development Lead & Overall Team Lead",
    team: "6-BYTE Studios · 6-person team",
    timeline: "3-week commissioned build",
    projectType: "Commissioned Church Game",
    challenge:
      "We needed to create an engaging touchless game for recurring church activities, combining reliable hand tracking with a client-specific visual identity and a setup that could run smoothly during weekend programs.",
    approach: [
      "I adapted the gesture-control architecture used for Wave & Wish, mapping MediaPipe hand landmarks to responsive in-game movement through OpenCV.",
      "I led the team in tailoring the gameplay, interface, and visual presentation to Estancia Baptist Church and its participants.",
      "I prepared the Python game for dependable Windows operation so church staff could run it during recurring weekend activities.",
    ],
    results: [
      "We delivered the paid commission in three weeks",
      "Our game served approximately 20–40 participants per weekend day",
      "We tailored the touchless gameplay for Estancia Baptist Church",
      "Our game was used during recurring weekend church activities",
    ],
  },
  {
    slug: "iloilo-farmers-hub",
    title: "Iloilo Farmers Hub",
    eyebrow: "Digital Marketplace",
    summary:
      "I led backend development for a four-person farmer marketplace. Our work was informed by 20+ interviews and validated through five test orders.",
    image: projectAsset("IFC-v3.webp"),
    liveUrl: "https://iloilo-farmers-hub.web.app/",
    githubUrl: "https://github.com/randrada-usa",
    tags: ["React", "TypeScript", "Firebase", "Computer Vision"],
    role: "Backend Lead & Frontend Contributor",
    team: "4-person Academic Team",
    timeline: "Oct 2025–Apr 2026",
    projectType: "Team Project",
    challenge:
      "I needed to coordinate inventory, orders, identity verification, and media uploads on a serverless stack while keeping the platform reliable on low-end Android devices.",
    approach: [
      "I designed the Firestore schema and transaction flows that prevent overselling across inventory and order systems.",
      "I built AI-assisted KYC using Google Vision for ID extraction and Face++ for face matching, with secrets protected by Cloud Functions.",
      "I implemented chunked image and video uploads, Firestore security rules, authentication flows, and deployment infrastructure.",
    ],
    results: [
      "We shaped the requirements through interviews with 20+ farmers in Oton, Iloilo",
      "We completed five end-to-end test orders during development",
      "We validated image and video uploads up to 15 MB",
    ],
  },
  {
    slug: "e-serbisyo-rizal",
    title: "e-Serbisyo Rizal",
    eyebrow: "Digital Governance Platform",
    summary:
      "I led backend and AI integration for a four-person barangay platform. We validated five service workflows with 15 test participants at zero operating cost.",
    image: projectAsset("e-serbisyo-rizal-v3.webp"),
    liveUrl: "https://eserbisyorizalv2.web.app/",
    githubUrl: "https://github.com/randrada-usa",
    tags: ["React", "TypeScript", "Firebase", "Gemini API"],
    role: "Backend Lead & API Integration Owner",
    team: "4-person Academic Team",
    timeline: "Feb–May 2025",
    projectType: "Team Project",
    challenge:
      "I needed to deliver useful AI-assisted public services within free-tier limits while navigating CORS, SDK conflicts, public access, and protected audit data.",
    approach: [
      "I built a direct REST integration for Gemini after the official SDK conflicted with the application environment.",
      "I designed Tagalog and English prompt routing with automatic language detection and constrained public chatbot access.",
      "I configured Firebase rules that permit public conversations while protecting administrative audit logs.",
    ],
    results: [
      "We validated all five service workflows with 15 test participants at a barangay hall",
      "We operated at zero cost using Firebase Spark and Gemini free tiers",
      "Our platform supported English, Filipino, and basic Hiligaynon interactions",
    ],
  },
];

const cert = (
  title: string,
  issuer: string,
  category: CertificationCategory,
  filename: string,
  description: string,
  year = "2026",
): Certification => ({
  slug: title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  title,
  issuer,
  category,
  image: certAsset(filename),
  year,
  description,
});

export const certifications: Certification[] = [
  cert("Data Analyst Associate", "DataCamp", "Data & Analytics", "DataCamp Data Analyst Associate Certification-v2.webp", "Associate-level validation of practical data analysis skills."),
  cert("SQL Associate", "DataCamp", "Data & Analytics", "DataCamp SQL Associate Certification-v2.webp", "Associate-level validation of SQL querying and data analysis."),
  cert("Introduction to Data Engineering", "DataCamp", "Data & Analytics", "DataCamp Intro to Data Engineering Course-v2.webp", "Foundations of data engineering systems, workflows, and responsibilities."),
  cert("Introduction to Data Science", "Cisco", "Data & Analytics", "CISCO Intro to Data Science Course.webp", "An introduction to the data science lifecycle and real-world applications."),
  cert("AI Fundamentals", "DataCamp", "Artificial Intelligence", "DataCamp AI Fundamentals-v2.webp", "Credential covering essential artificial-intelligence concepts and applications."),
  cert("AI Fluency", "Anthropic", "Artificial Intelligence", "Anthropic AI Fluency.webp", "Practical foundations for working effectively and responsibly with AI."),
  cert("Claude 101", "Anthropic", "Artificial Intelligence", "Anthropic Claude 101.webp", "Foundational use of Claude for structured knowledge work."),
  cert("Claude Code 101", "Anthropic", "Artificial Intelligence", "Anthropic Claude Code 101.webp", "Agentic coding workflows with Claude Code."),
  cert("Foundations of Prompt Engineering", "AWS", "Cloud & Development", "AWS Foundations of Prompt Engineering.webp", "Prompt-engineering foundations for generative AI applications."),
  cert("Python Developer Associate", "DataCamp", "Cloud & Development", "DataCamp Python Developer Associate.webp", "Associate-level certification in Python software development."),
  cert("AI on the Cloud", "AWS & Google Cloud", "Cloud & Development", "AI on the Cloud_ Training Models Without a GPU using AWS and Google Cloud_certificate-signatures-blurred-v2.webp", "Training AI models with managed cloud resources rather than local GPUs."),
  cert("Python Essentials 1", "Cisco", "Cloud & Development", "CISCO Python Essentials 1.webp", "Core Python syntax, control flow, data structures, and functions."),
  cert("Networking Basics", "Cisco Networking Academy", "Cloud & Development", "CISCO Networking Basics.webp", "Foundations of network communication, protocols, Ethernet, IP addressing, routing, connectivity troubleshooting, and secure wired and wireless networks."),
  cert("Introduction to Cybersecurity", "Cisco Networking Academy", "Cloud & Development", "CISCO Introduction to Cybersecurity.webp", "Foundations of online safety, common cyber threats and vulnerabilities, personal protection, and organizational cybersecurity practices."),
  cert("Docker & Kubernetes", "Course Certificate", "Cloud & Development", "Containerization and Virtualization with Docker and Kubernetes-v2.webp", "Containerization, virtualization, and orchestration foundations."),
  cert("GitHub Foundations Certification", "GitHub", "Software & Tools", "GitHub Foundations Certification.webp", "Industry-recognized validation of foundational GitHub concepts, collaborative development, repositories, and project management."),
  cert("A.IGNITE", "Event Certificate", "Artificial Intelligence", "A.IGNITE-signatures-blurred-v2.webp", "Participation in an applied AI learning event."),
  {
    slug: "relx-ai-summit-academe-hackathon",
    title: "RELX AI Summit Academe Hackathon — 2nd Runner-Up",
    issuer: "RELX / Reed Elsevier Philippines",
    category: "Hackathons & Events",
    image: projectAsset("orbitiq/award-certificate.webp"),
    year: "2026",
    description: "I earned 2nd Runner-Up with Team WeUseDockers at the RELX / Reed Elsevier Philippines AI Summit Academe Hackathon on October 9, 2026. We built OrbitIQ, an AI-assisted invoice exception management system, during an approximately five-hour sprint. I led the backend and AI workflow, including financial validation rules, Claude integration through AWS Bedrock, and safety controls that kept final financial decisions with human analysts.",
  },
  cert("AWS Community Day Philippines 2026", "AWS User Group Philippines", "Hackathons & Events", "AWS Community Day Philippines 2026-signatures-blurred-v2.webp", "Participation in the second day of AWS Community Day Philippines 2026, centered on the Build, Break, Repeat theme."),
  cert("Philippine Startup Challenge XI", "DICT Region VI", "Hackathons & Events", "Philippine Startup Challenge XI-signatures-blurred.webp", "Participated with Team RAY++ in DICT's student startup competition, proposing UGNAY, an offline-first emergency incident-report delivery platform. The concept would store and relay structured reports through nearby participating smartphones until a device regains connectivity, allowing reports to reach authorized responders. It also proposed a responder dashboard and future AI-assisted features for organizing and summarizing reports. Although our team did not advance, the experience helped us refine the idea, assess its technical and business feasibility, and position it around a real community need. Certificate issued October 14, 2026."),
  cert("Thanks, I Hate It - Graphic Design", "Event Certificate", "Hackathons & Events", "Thanks I Hate It-signatures-blurred-v2.webp", "Participation in The Good, The Bad, and The Ugly of Graphic Design event at the University of San Agustin."),
  cert("AIFEST", "Event Certificate", "Hackathons & Events", "AIFEST-signatures-blurred-v2.webp", "Participation in an artificial-intelligence festival and challenge."),
  cert("Chain of Thought", "Event Certificate", "Artificial Intelligence", "Chain of Thought-signatures-blurred-v2.webp", "Participation in a technology and AI learning program."),
  cert("SIKAPTALA National Hackathon", "SIKAPTALA", "Hackathons & Events", "SIKAPTALA National Hackathon-signatures-blurred-v2.webp", "National hackathon participation and collaborative product building."),
  cert("Ready, Spark, Charge 2026", "Hackathon", "Hackathons & Events", "Ready, Spark, Charge 2026 Hackathon-signatures-blurred-v2.webp", "Rapid team-based ideation and software prototyping."),
  cert("AI Workshop: Human Centric AI & Problem Solving", "Workshop", "Hackathons & Events", "AI Hackathon Workshop 1-signatures-blurred-v2.webp", "Hands-on preparation for AI-focused hackathon development."),
  cert("AI Workshop: Technical Architecture & Data Ethics", "Workshop", "Hackathons & Events", "AI Hackathon Workshop 2-signatures-blurred-v2.webp", "Advanced applied preparation for AI-focused hackathon work."),
  cert("UX Western Visayas", "UX Western Visayas", "Software & Tools", "UIUX-signatures-blurred-v2.webp", "Community learning in user experience and interface design."),
  cert("Augustinian Developers Society", "Developer Community", "Cloud & Development", "GDSC-signatures-blurred-v2.webp", "Participation and contribution within a student developer community."),
];

export const certificationCategories: CertificationCategory[] = [
  "Data & Analytics",
  "Artificial Intelligence",
  "Cloud & Development",
  "Software & Tools",
  "Hackathons & Events",
];

export const experience = [
  { organization: "Institute of Computer Science", role: "Vice President for Technology", dates: "June 2026–Present", image: experienceAsset("institute-of-computer-science.webp") },
  { organization: "Augustinian Developers Society", role: "Web Development Lead", dates: "June 2026–Present", image: experienceAsset("ads-web-development-lead.webp") },
  { organization: "6-BYTE Studios", role: "CEO / Full-Stack Developer", dates: "June 2025–Present", image: experienceAsset("6-byte-studios.webp") },
  { organization: "Holotech Society", role: "Vice Chairperson — External", dates: "June 2025–2026", image: experienceAsset("holotech-society.webp") },
  { organization: "Augustinian Developers Society", role: "Senior Developer", dates: "Aug 2025–2026", image: experienceAsset("ads-senior-developer.webp") },
];

export const coreStack = {
  "Backend & Data": ["Python", "Node.js", "SQL", "PostgreSQL", "Firebase"],
  Frontend: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  "Cloud & APIs": ["AWS", "Google Cloud", "REST APIs", "Gemini API", "Vision API"],
  Tools: ["Git", "GitHub", "Figma", "Power BI", "Jupyter"],
};

export const coreStackIcons: Record<string, string> = Object.fromEntries(
  Object.entries({
    Python: "python-original.svg",
    "Node.js": "nodejs-original.svg",
    PostgreSQL: "postgresql-original.svg",
    Firebase: "firebase-original.svg",
    TypeScript: "typescript-original.svg",
    React: "react-original.svg",
    "Next.js": "nextjs-original.svg",
    "Tailwind CSS": "tailwindcss-original.svg",
    AWS: "Amazon-Web-Services.webp",
    "Google Cloud": "googlecloud-original.svg",
    "REST APIs": "restfulAPI-logo.webp",
    "Gemini API": "Google_Gemini.webp",
    "Vision API": "Cloud-Vision-API.svg",
    Git: "git-original.svg",
    GitHub: "github-original.svg",
    Figma: "figma-original.svg",
    "Power BI": "PowerBI-original.svg",
    Jupyter: "jupyter-original.svg",
  }).map(([name, file]) => [name, `/assets/icons/skills/${file}`]),
);

export const socialLinks = {
  email: "mailto:rayalejaga12@gmail.com",
  github: "https://github.com/randrada-usa",
  linkedin: "https://www.linkedin.com/in/rjandrada/",
};

export const talkLink =
  "mailto:rayalejaga12@gmail.com";

