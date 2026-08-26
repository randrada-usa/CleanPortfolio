export type Project = {
  slug: string;
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

export const projects: Project[] = [
  {
    slug: "wave-and-wish",
    title: "Wave & Wish",
    eyebrow: "Computer Vision Game",
    summary: "A touchless festival game controlled entirely through real-time hand gestures.",
    image: projectAsset("wave-and-wish.webp"),
    tags: ["Python", "Pygame", "OpenCV", "MediaPipe"],
    role: "Full-Stack Game Developer",
    team: "6-BYTE Studios",
    timeline: "Capiztahan 2026",
    projectType: "Team Project",
    challenge:
      "Build a camera-controlled festival game that could survive a seven-hour public event, difficult lighting, rapid player turnover, and a fixed physical-prize inventory.",
    approach: [
      "Mapped MediaPipe palm landmarks to screen coordinates with exponential smoothing, a deadzone, and position prediction for brief tracking loss.",
      "Designed a dynamic difficulty system, anti-streak spawn rules, three fully themed content sets, and an event-driven mascot HUD.",
      "Built an auditable gacha system with configurable win rates, multiple wishes, unique claim codes, and JSONL result logging.",
      "Packaged the Python application for Windows with a custom PyInstaller specification covering MediaPipe models and OpenCV dependencies.",
    ],
    results: [
      "280+ players served in seven hours",
      "170 physical prizes distributed",
      "0 crashes during the event",
    ],
  },
  {
    slug: "iloilo-farmers-hub",
    title: "Iloilo Farmers Hub",
    eyebrow: "Digital Marketplace",
    summary: "A secure marketplace connecting Iloilo farmers directly with local consumers.",
    image: projectAsset("IFC-v2.webp"),
    liveUrl: "https://iloilo-farmers-hub.web.app/",
    githubUrl: "https://github.com/randrada-usa",
    tags: ["React", "TypeScript", "Firebase", "Computer Vision"],
    role: "Backend Lead & Frontend Contributor",
    team: "Academic Team Project",
    timeline: "Oct 2025–Apr 2026",
    projectType: "Team Project",
    challenge:
      "Coordinate inventory, orders, identity verification, and media uploads on a serverless stack while remaining reliable on low-end Android devices.",
    approach: [
      "Designed the Firestore schema and transaction flows that prevent overselling across inventory and order systems.",
      "Built AI-assisted KYC using Google Vision for ID extraction and Face++ for face matching, with secrets protected by Cloud Functions.",
      "Implemented chunked image and video uploads, Firestore security rules, authentication flows, and deployment infrastructure.",
    ],
    results: [
      "Consistent inventory under concurrent orders",
      "Server-side protection for API keys and privileged workflows",
      "More reliable uploads on low-memory mobile devices",
    ],
  },
  {
    slug: "e-serbisyo-rizal",
    title: "e-Serbisyo Rizal",
    eyebrow: "Digital Governance Platform",
    summary: "A bilingual AI-assisted platform for digital barangay services.",
    image: projectAsset("e-serbisyo-rizal-v2.webp"),
    liveUrl: "https://eserbisyorizalv2.web.app/",
    githubUrl: "https://github.com/randrada-usa",
    tags: ["React", "TypeScript", "Firebase", "Gemini API"],
    role: "Backend Lead & API Integration Owner",
    team: "Academic Team Project",
    timeline: "Feb–May 2025",
    projectType: "Team Project",
    challenge:
      "Deliver useful AI-assisted public services within free-tier limits while navigating CORS, SDK conflicts, public access, and protected audit data.",
    approach: [
      "Built a direct REST integration for Gemini after the official SDK conflicted with the application environment.",
      "Designed Tagalog and English prompt routing with automatic language detection and constrained public chatbot access.",
      "Configured Firebase rules that permit public conversations while protecting administrative audit logs.",
    ],
    results: [
      "Zero-cost operating model using Firebase Spark and Gemini free tiers",
      "Bilingual support for public-service questions",
      "Separated public interaction data from restricted admin records",
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
  cert("Understanding Data Engineering", "DataCamp", "Data & Analytics", "DataCamp Understanding Data Engineering Course-v2.webp", "Core concepts behind reliable data platforms and pipelines."),
  cert("Introduction to Data Science", "Cisco", "Data & Analytics", "CISCO Intro to Data Science Course.webp", "An introduction to the data science lifecycle and real-world applications."),
  cert("AI Fundamentals", "DataCamp", "Artificial Intelligence", "DataCamp AI Fundamentals-v2.webp", "Credential covering essential artificial-intelligence concepts and applications."),
  cert("AI Fundamentals Course", "DataCamp", "Artificial Intelligence", "DataCamp AI Fundamentals Course-v2.webp", "Coursework in machine learning, generative AI, and responsible use."),
  cert("AI Ethics", "DataCamp", "Artificial Intelligence", "DataCamp AI Ethics Course-v2.webp", "Responsible AI principles, risks, fairness, and governance."),
  cert("AI Fluency", "Anthropic", "Artificial Intelligence", "Anthropic AI Fluency.webp", "Practical foundations for working effectively and responsibly with AI."),
  cert("Claude 101", "Anthropic", "Artificial Intelligence", "Anthropic Claude 101.webp", "Foundational use of Claude for structured knowledge work."),
  cert("Claude Code 101", "Anthropic", "Artificial Intelligence", "Anthropic Claude Code 101.webp", "Agentic coding workflows with Claude Code."),
  cert("Foundations of Prompt Engineering", "AWS", "Cloud & Development", "AWS Foundations of Prompt Engineering.webp", "Prompt-engineering foundations for generative AI applications."),
  cert("AI on the Cloud", "AWS & Google Cloud", "Cloud & Development", "AI on the Cloud_ Training Models Without a GPU using AWS and Google Cloud_certificate.webp", "Training AI models with managed cloud resources rather than local GPUs."),
  cert("Python Essentials 1", "Cisco", "Cloud & Development", "CISCO Python Essentials 1.webp", "Core Python syntax, control flow, data structures, and functions."),
  cert("Docker & Kubernetes", "Course Certificate", "Cloud & Development", "Containerization and Virtualization with Docker and Kubernetes-v2.webp", "Containerization, virtualization, and orchestration foundations."),
  cert("GitHub Foundations", "DataCamp", "Software & Tools", "DataCamp Github Foundations Course-v2.webp", "Version control and collaborative development workflows on GitHub."),
  cert("A.IGNITE", "Event Certificate", "Artificial Intelligence", "A.IGNITE.webp", "Participation in an applied AI learning event."),
  cert("AIFEST", "Event Certificate", "Hackathons & Events", "AIFEST.webp", "Participation in an artificial-intelligence festival and challenge."),
  cert("Chain of Thought", "Event Certificate", "Artificial Intelligence", "Chain of Thought.webp", "Participation in a technology and AI learning program."),
  cert("SIKAPTALA National Hackathon", "SIKAPTALA", "Hackathons & Events", "SIKAPTALA National Hackathon.webp", "National hackathon participation and collaborative product building."),
  cert("Ready, Spark, Charge 2026", "Hackathon", "Hackathons & Events", "Ready, Spark, Charge 2026 Hackathon.webp", "Rapid team-based ideation and software prototyping."),
  cert("AI Workshop: Human Centric AI & Problem Solving", "Workshop", "Hackathons & Events", "AI Hackathon Workshop 1.webp", "Hands-on preparation for AI-focused hackathon development."),
  cert("AI Workshop: Technical Architecture & Data Ethics", "Workshop", "Hackathons & Events", "AI Hackathon Workshop 2.webp", "Advanced applied preparation for AI-focused hackathon work."),
  cert("UX Western Visayas", "UX Western Visayas", "Software & Tools", "UIUX.webp", "Community learning in user experience and interface design."),
  cert("Augustinian Developers Society", "Developer Community", "Cloud & Development", "GDSC.webp", "Participation and contribution within a student developer community."),
];

export const certificationCategories: CertificationCategory[] = [
  "Data & Analytics",
  "Artificial Intelligence",
  "Cloud & Development",
  "Software & Tools",
  "Hackathons & Events",
];

export const experience = [
  { organization: "Institute of Computer Science", role: "Vice President for Technology", dates: "June 2026–Present" },
  { organization: "Augustinian Developers Society", role: "Web Development Lead", dates: "June 2026–Present" },
  { organization: "6-BYTE Studios", role: "CEO / Full-Stack Developer", dates: "June 2025–Present", image: projectAsset("wave-and-wish.webp") },
  { organization: "Holotech Society", role: "Vice Chairperson — External", dates: "June 2025–2026" },
  { organization: "Augustinian Developers Society", role: "Senior Developer", dates: "Aug 2025–2026" },
];

export const coreStack = {
  "Backend & Data": ["Python", "Node.js", "SQL", "PostgreSQL", "Firebase"],
  Frontend: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
  "Cloud & APIs": ["AWS", "Google Cloud", "REST APIs", "Gemini API", "Vision API"],
  Tools: ["Git", "GitHub", "Figma", "Power BI", "Jupyter"],
};

export const socialLinks = {
  email: "mailto:rayalejaga12@gmail.com",
  github: "https://github.com/randrada-usa",
  linkedin: "https://www.linkedin.com/in/rey-jane-andrada-49701242a/",
};
