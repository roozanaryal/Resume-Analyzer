import { PDFParse } from "pdf-parse";

// Comprehensive Multi-Domain Skill Dictionary (Tech, Design, Business, Marketing, Sales, Operations, HR)
export const COMPREHENSIVE_SKILL_DICTIONARY: string[] = [
  // Programming Languages & Web Runtimes
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "Ruby", "Go", "Golang",
  "Rust", "PHP", "Swift", "Kotlin", "Scala", "R", "SQL", "PL/SQL", "T-SQL", "HTML", "HTML5",
  "CSS", "CSS3", "Bash", "Shell", "PowerShell", "Perl", "Matlab", "Dart", "Assembly", "Elixir", "Haskell",

  // Frontend, Mobile & Frameworks
  "React", "React.js", "ReactJS", "React Native", "Next.js", "NextJS", "Vue", "Vue.js", "VueJS", "Angular", "Svelte",
  "Redux", "Zustand", "Tailwind", "Tailwind CSS", "TailwindCSS", "Bootstrap", "Material UI",
  "Chakra UI", "Sass", "SCSS", "Webpack", "Vite", "Babel", "jQuery", "RxJS", "Flutter",

  // Backend Frameworks & Runtimes
  "Node.js", "NodeJS", "Node", "Express", "Express.js", "ExpressJS", "NestJS", "FastAPI", "Django", "Flask", "Spring",
  "Spring Boot", "ASP.NET", ".NET", ".NET Core", "Ruby on Rails", "Rails", "Laravel", "Koa", "GraphQL", "REST API",

  // Databases & Storage
  "PostgreSQL", "Postgres", "MySQL", "MongoDB", "Redis", "SQLite", "Firebase", "Firestore",
  "Cassandra", "DynamoDB", "Oracle", "SQL Server", "Elasticsearch", "Neo4j", "MariaDB",
  "Supabase", "Prisma", "Sequelize", "Mongoose",

  // Cloud, DevOps & Infrastructure
  "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud Platform", "Docker", "Kubernetes",
  "K8s", "Terraform", "CI/CD", "GitHub Actions", "Jenkins", "Ansible", "Linux", "Unix",
  "Nginx", "Serverless", "Microservices", "Cloudflare", "Helm", "Prometheus", "Grafana",

  // AI, Data Science & Analytics
  "Git", "GitHub", "GitLab", "Jest", "Cypress", "Playwright", "Selenium",
  "Machine Learning", "Deep Learning", "Artificial Intelligence", "AI", "NLP", "Computer Vision",
  "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "OpenCV", "Agile", "Scrum",
  "Data Analysis", "Data Science", "Data Engineering", "Power BI", "Tableau", "Excel",

  // Design, UX & Creative
  "UI/UX Design", "UI Design", "UX Design", "Figma", "Adobe XD", "Photoshop", "Illustrator",
  "Wireframing", "Prototyping", "User Research", "Graphic Design", "Canva",

  // Business, Marketing, Sales & Operations
  "Project Management", "Product Management", "Digital Marketing", "SEO", "SEM", "Content Writing",
  "Copywriting", "Social Media Marketing", "Email Marketing", "Google Analytics", "Branding",
  "Business Development", "Lead Generation", "Sales Strategy", "CRM", "Salesforce", "HubSpot",
  "Account Management", "Customer Service", "Customer Success", "Negotiation", "Financial Analysis",
  "Accounting", "Budgeting", "Risk Management", "Recruitment", "Talent Acquisition", "Human Resources", "HR Operations"
];

// Alias mapping dictionary to collapse variants (e.g. node.js -> nodejs, ts -> typescript)
export const SKILL_ALIAS_MAP: Record<string, string> = {
  // Node variants
  "node": "nodejs",
  "node.js": "nodejs",
  "nodejs": "nodejs",
  "node js": "nodejs",

  // React variants
  "react": "react",
  "react.js": "react",
  "reactjs": "react",
  "react js": "react",

  // Vue variants
  "vue": "vue",
  "vue.js": "vue",
  "vuejs": "vue",
  "vue js": "vue",

  // Next variants
  "next": "next.js",
  "next.js": "next.js",
  "nextjs": "next.js",
  "next js": "next.js",

  // Express variants
  "express": "express",
  "express.js": "express",
  "expressjs": "express",
  "express js": "express",

  // TypeScript / JavaScript
  "ts": "typescript",
  "typescript": "typescript",
  "js": "javascript",
  "javascript": "javascript",
  "ecmascript": "javascript",

  // Languages
  "py": "python",
  "python": "python",
  "python3": "python",
  "c++": "cpp",
  "cpp": "cpp",
  "c#": "csharp",
  "csharp": "csharp",

  // Databases
  "postgres": "postgresql",
  "postgresql": "postgresql",
  "mongo": "mongodb",
  "mongodb": "mongodb",

  // Cloud & Infra
  "aws": "aws",
  "amazon web services": "aws",
  "gcp": "gcp",
  "google cloud": "gcp",
  "google cloud platform": "gcp",
  "k8s": "kubernetes",
  "kubernetes": "kubernetes",
  "docker": "docker",

  // Design & Business
  "ui/ux": "ui/ux design",
  "ui/ux design": "ui/ux design",
  "ui ux": "ui/ux design",
  "ux design": "ui/ux design",
  "ui design": "ui/ux design",
  "seo": "digital marketing",
  "digital marketing": "digital marketing",
  "pm": "project management",
  "project management": "project management",
  "product management": "product management",
  "business development": "business development",
  "bizdev": "business development",
};

/**
 * Normalizes a skill term to its canonical representation (case-insensitive & alias matched)
 */
export function normalizeSkill(skill: string): string {
  if (!skill) return "";
  const cleaned = skill.toLowerCase().trim();

  // 1. Direct alias match
  if (SKILL_ALIAS_MAP[cleaned]) {
    return SKILL_ALIAS_MAP[cleaned];
  }

  // 2. Strip dots, dashes, spaces
  const stripped = cleaned.replace(/\./g, "").replace(/[\s-]+/g, "");
  if (SKILL_ALIAS_MAP[stripped]) {
    return SKILL_ALIAS_MAP[stripped];
  }

  return stripped;
}

export interface ParsedResumeData {
  email: string | null;
  skills: string[];
  experienceYears: number;
  education: string[];
  certifications: string[];
  rawText: string;
}

/**
 * Extract raw text from PDF buffer using pdf-parse
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: pdfBuffer });
    const textResult = await parser.getText();
    await parser.destroy();
    return textResult.text || "";
  } catch (error) {
    console.error("Error parsing PDF buffer:", error);
    return "";
  }
}

/**
 * Normalizes text for processing
 */
export function normalizeText(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ");
}

/**
 * Email Extraction via exact RegEx: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
 */
export function extractEmail(text: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0].toLowerCase() : null;
}

// Pre-compiled skill regex array sorted by length descending (allocated ONCE at module load)
const PRECOMPILED_SKILL_REGEXES = [...COMPREHENSIVE_SKILL_DICTIONARY]
  .sort((a, b) => b.length - a.length)
  .map((skill) => {
    const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    return {
      skill,
      regex: new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escapedSkill}(?:$|[^a-zA-Z0-9_#+])`, "i"),
    };
  });

/**
 * Technical Skill Extraction using pre-compiled dictionary & RegEx boundary rules
 */
export function extractSkills(text: string): string[] {
  if (!text) return [];
  const foundSkills = new Set<string>();

  for (let i = 0; i < PRECOMPILED_SKILL_REGEXES.length; i++) {
    const item = PRECOMPILED_SKILL_REGEXES[i]!;
    if (item.regex.test(text)) {
      foundSkills.add(item.skill);
    }
  }

  return Array.from(foundSkills);
}

/**
 * Work Experience Extraction (Years of Experience) via RegEx & Date Processing
 */
export function extractExperienceYears(text: string): number {
  let maxYears = 0;

  // 1. Explicit years of experience patterns (e.g., "5 years of experience", "3+ yrs exp")
  const expPattern = /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp|working)?/gi;
  let match: RegExpExecArray | null;

  while ((match = expPattern.exec(text)) !== null) {
    if (match[1]) {
      const yrs = parseFloat(match[1]);
      if (yrs > maxYears && yrs < 40) {
        maxYears = yrs;
      }
    }
  }

  // 2. Date Range patterns (e.g., 2018 - 2023, 2020 - Present)
  const currentYear = new Date().getFullYear();
  const dateRangePattern = /\b(19\d{2}|20\d{2})\s*(?:-|–|to)\s*(19\d{2}|20\d{2}|present|current|now)\b/gi;
  let totalCalculatedYears = 0;

  while ((match = dateRangePattern.exec(text)) !== null) {
    if (match[1] && match[2]) {
      const startYr = parseInt(match[1], 10);
      const endStr = match[2].toLowerCase();
      const endYr = (endStr === "present" || endStr === "current" || endStr === "now")
        ? currentYear
        : parseInt(endStr, 10);

      if (endYr >= startYr && startYr > 1980 && endYr <= currentYear + 1) {
        totalCalculatedYears += (endYr - startYr);
      }
    }
  }

  return Math.max(maxYears, totalCalculatedYears);
}

/**
 * Education Extraction via RegEx Rules
 */
export function extractEducation(text: string): string[] {
  const educationList: string[] = [];

  const eduRules = [
    { name: "Ph.D / Doctorate", pattern: /\b(Ph\.?D\.?|Doctorate|Doctor of Philosophy)\b/i },
    { name: "Master's Degree", pattern: /\b(Master(?:'s)?|M\.?S\.?|M\.?Sc\.?|M\.?Tech\.?|M\.?E\.?|MBA)\b/i },
    { name: "Bachelor's Degree", pattern: /\b(Bachelor(?:'s)?|B\.?S\.?|B\.?Sc\.?|B\.?Tech\.?|B\.?E\.?)\b/i },
    { name: "Associate Degree", pattern: /\b(Associate(?:'s)?|A\.?S\.?|A\.?A\.?)\b/i },
    { name: "Computer Science Major", pattern: /\b(Computer Science|CS)\b/i },
    { name: "Information Technology", pattern: /\b(Information Technology|IT)\b/i },
    { name: "Software Engineering", pattern: /\b(Software Engineering)\b/i },
  ];

  for (const rule of eduRules) {
    if (rule.pattern.test(text)) {
      educationList.push(rule.name);
    }
  }

  return educationList;
}

/**
 * Certifications Extraction via RegEx Rules
 */
export function extractCertifications(text: string): string[] {
  const certList: string[] = [];

  const certRules = [
    { name: "AWS Certified", pattern: /\b(AWS Certified|Amazon Web Services Certified)\b/i },
    { name: "Azure Certified", pattern: /\b(Azure Certified|Microsoft Certified)\b/i },
    { name: "Google Cloud Certified", pattern: /\b(GCP Certified|Google Cloud Certified)\b/i },
    { name: "Kubernetes Certified (CKA/CKAD)", pattern: /\b(CKA|CKAD|Certified Kubernetes)\b/i },
    { name: "PMP", pattern: /\b(PMP|Project Management Professional)\b/i },
    { name: "CISSP", pattern: /\b(CISSP|Certified Information Systems Security Professional)\b/i },
    { name: "CompTIA", pattern: /\b(CompTIA|Security\+|Network\+|A\+)\b/i },
    { name: "Cisco Certified (CCNA/CCNP)", pattern: /\b(CCNA|CCNP|Cisco Certified)\b/i },
    { name: "Certified Scrum Master (CSM)", pattern: /\b(CSM|Scrum Master|Agile Certified)\b/i },
  ];

  for (const rule of certRules) {
    if (rule.pattern.test(text)) {
      certList.push(rule.name);
    }
  }

  return certList;
}

/**
 * Main Entry Point: Parses text into structured resume data
 */
export function parseResumeText(rawText: string): ParsedResumeData {
  const normalized = normalizeText(rawText);

  return {
    email: extractEmail(normalized),
    skills: extractSkills(normalized),
    experienceYears: extractExperienceYears(normalized),
    education: extractEducation(normalized),
    certifications: extractCertifications(normalized),
    rawText: normalized,
  };
}

/**
 * Helper to read PDF file, parse content, and upsert ParsedResume model in DB
 */
export async function parseAndSaveUserResume(userId: string, filePath: string) {
  try {
    const fs = await import("fs");
    const { prisma } = await import("../config/db.js");

    if (!fs.existsSync(filePath)) return null;
    const fileBuffer = fs.readFileSync(filePath);
    const rawText = await extractTextFromPDF(fileBuffer);
    const parsed = parseResumeText(rawText);

    const parsedResume = await prisma.parsedResume.upsert({
      where: { userId },
      create: {
        userId,
        email: parsed.email,
        skills: JSON.stringify(parsed.skills),
        experienceYears: parsed.experienceYears,
        education: JSON.stringify(parsed.education),
        certifications: JSON.stringify(parsed.certifications),
        rawText: parsed.rawText,
      },
      update: {
        email: parsed.email,
        skills: JSON.stringify(parsed.skills),
        experienceYears: parsed.experienceYears,
        education: JSON.stringify(parsed.education),
        certifications: JSON.stringify(parsed.certifications),
        rawText: parsed.rawText,
      },
    });

    return parsedResume;
  } catch (err) {
    console.error("Error in parseAndSaveUserResume:", err);
    return null;
  }
}

