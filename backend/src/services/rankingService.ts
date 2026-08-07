import { extractSkills, extractExperienceYears, normalizeSkill } from "./resumeParserService.js";

export interface CandidateProfileForRanking {
  id: string;
  userId: string;
  name: string;
  email: string;
  bio?: string | null;
  skills: string[];
  experienceYears: number;
  education?: string[];
  certifications?: string[];
  resumeURL?: string | null;
  status: string;
  createdAt: Date;
}

export interface JobRequirementsForRanking {
  id: string;
  title: string;
  description: string;
  skillsRequired?: string | null;
  experienceRequired?: string | null;
}

export interface CandidateRankingResult extends CandidateProfileForRanking {
  finalScore: number;          // 0 - 100 percentage
  cosineSimilarity: number;    // 0 - 1.0
  skillMatchPercentage: number;// 0 - 100 percentage
  experienceScore: number;     // 0 - 1.0
  matchedSkills: string[];
  missingSkills: string[];
}

/**
 * Extracts required skills list from job title, skillsRequired field, and description text
 */
export function extractJobRequiredSkills(job: JobRequirementsForRanking): string[] {
  const skillSet = new Set<string>();

  // 1. Parse explicitly listed skills in job.skillsRequired
  if (job.skillsRequired) {
    const rawSkills = job.skillsRequired.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
    for (const skill of rawSkills) {
      skillSet.add(skill);
    }
  }

  // 2. Extract skills from job title (e.g., "Node.js Developer", "UI/UX Designer")
  if (job.title) {
    const titleSkills = extractSkills(job.title);
    for (const skill of titleSkills) {
      skillSet.add(skill);
    }
  }

  // 3. Extract skills from job description using multi-domain dictionary
  if (job.description) {
    const extractedFromDesc = extractSkills(job.description);
    for (const skill of extractedFromDesc) {
      skillSet.add(skill);
    }
  }

  return Array.from(skillSet);
}

/**
 * Parses required experience years from job experienceRequired string or description
 */
export function parseJobRequiredExperience(job: JobRequirementsForRanking): number {
  if (job.experienceRequired) {
    const yrs = extractExperienceYears(job.experienceRequired);
    if (yrs > 0) return yrs;
    
    // Direct regex match for single numbers (e.g. "3 years", "5")
    const match = job.experienceRequired.match(/(\d+(?:\.\d+)?)/);
    if (match && match[1]) {
      return parseFloat(match[1]);
    }
  }

  if (job.description) {
    return extractExperienceYears(job.description);
  }

  return 0;
}

// Mapping of high-level/framework skills to their implied/dependent technologies
export const SKILL_DEPENDENCY_MAP: Record<string, string[]> = {
  // Front-end frameworks & libraries
  "next.js": ["React", "JavaScript", "HTML", "CSS"],
  "react": ["JavaScript", "HTML", "CSS"],
  "vue": ["JavaScript", "HTML", "CSS"],
  "angular": ["TypeScript", "JavaScript", "HTML", "CSS"],
  "svelte": ["JavaScript", "HTML", "CSS"],
  "react native": ["React", "JavaScript", "HTML", "CSS"],

  // Runtimes & Backend Frameworks
  "nestjs": ["TypeScript", "NodeJS", "JavaScript"],
  "express": ["NodeJS", "JavaScript"],
  "nodejs": ["JavaScript"],

  // Languages
  "typescript": ["JavaScript"],

  // Backend / Fullstack frameworks
  "django": ["Python"],
  "flask": ["Python"],
  "fastapi": ["Python"],
  "spring boot": ["Java"],
  "spring": ["Java"],
  "laravel": ["PHP"],
  "ruby on rails": ["Ruby"],
  "flutter": ["Dart"],
};

/**
 * Expands candidate skills recursively to include implied/dependent skills
 */
export function expandCandidateSkills(candidateSkills: string[]): string[] {
  const expandedSet = new Set<string>();

  for (const s of candidateSkills) {
    if (s) expandedSet.add(s.trim());
  }

  let addedNew = true;
  while (addedNew) {
    addedNew = false;
    const currentSkills = Array.from(expandedSet);
    for (const skill of currentSkills) {
      const norm = normalizeSkill(skill);
      const dependencies = SKILL_DEPENDENCY_MAP[norm];
      if (dependencies) {
        for (const dep of dependencies) {
          const normDep = normalizeSkill(dep);
          const alreadyHas = Array.from(expandedSet).some(
            (s) => normalizeSkill(s) === normDep
          );
          if (!alreadyHas) {
            expandedSet.add(dep);
            addedNew = true;
          }
        }
      }
    }
  }

  return Array.from(expandedSet);
}

/**
 * Calculates Cosine Similarity between Job Required Skill Vector and Candidate Skill Vector
 * Supports case-insensitive matching, alias normalization (node.js == NodeJS == Node), and substring matches.
 */
export function calculateCosineSimilarity(
  jobSkills: string[],
  candidateSkills: string[]
): {
  similarity: number;
  matchedSkills: string[];
  missingSkills: string[];
} {
  const expandedCandidateSkills = expandCandidateSkills(candidateSkills);

  if (jobSkills.length === 0) {
    return { similarity: 1.0, matchedSkills: expandedCandidateSkills, missingSkills: [] };
  }

  // Build unique job skills dictionary
  const jobDict = Array.from(new Set(jobSkills));
  
  // Normalize candidate skills into canonical forms & lowercased set
  const normCandidateSkills = expandedCandidateSkills.map((s) => normalizeSkill(s)).filter(Boolean);
  const candLowerSkills = expandedCandidateSkills.map((s) => s.toLowerCase().trim());

  let dotProduct = 0;
  let jobMagSq = 0;
  let candMagSq = 0;

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (let i = 0; i < jobDict.length; i++) {
    const rawJobSkill = jobDict[i]!;
    const normJobSkill = normalizeSkill(rawJobSkill);
    const lowerJobSkill = rawJobSkill.toLowerCase().trim();

    // Check matching rules:
    // 1. Exact canonical normalized match (e.g. "node.js" -> "nodejs", "NodeJS" -> "nodejs", "Node" -> "nodejs")
    // 2. Exact lowercased string match
    // 3. Substring containment match (e.g. "React.js" contains "React")
    const isMatched =
      (normJobSkill && normCandidateSkills.includes(normJobSkill)) ||
      candLowerSkills.includes(lowerJobSkill) ||
      candLowerSkills.some((cand) => {
        if (!cand || !lowerJobSkill) return false;
        return (
          cand.includes(lowerJobSkill) ||
          lowerJobSkill.includes(cand) ||
          (normJobSkill && cand.replace(/[^a-z0-9]/g, "").includes(normJobSkill))
        );
      });

    const jVal = 1;
    const cVal = isMatched ? 1 : 0;

    dotProduct += jVal * cVal;
    jobMagSq += jVal * jVal;
    candMagSq += cVal * cVal;

    if (isMatched) {
      matchedSkills.push(rawJobSkill);
    } else {
      missingSkills.push(rawJobSkill);
    }
  }

  if (jobMagSq === 0 || candMagSq === 0) {
    return { similarity: 0.0, matchedSkills, missingSkills };
  }

  const similarity = dotProduct / (Math.sqrt(jobMagSq) * Math.sqrt(candMagSq));
  return { similarity, matchedSkills, missingSkills };
}

/**
 * Normalizes candidate experience into an Experience Score (0 to 1.0)
 */
export function calculateExperienceScore(
  candidateExpYears: number,
  requiredExpYears: number
): number {
  if (requiredExpYears <= 0) {
    // If no experience specified, candidate gets 1.0 if they have experience, or scale up to 5 yrs max
    return Math.min(1.0, candidateExpYears > 0 ? 0.8 + (candidateExpYears / 25) : 0.7);
  }

  if (candidateExpYears >= requiredExpYears) {
    return 1.0;
  }

  return Math.min(1.0, candidateExpYears / requiredExpYears);
}

/**
 * Calculates Weighted Final Score: (Cosine Similarity * 0.7) + (Experience Score * 0.3)
 */
export function calculateFinalScore(
  cosineSimilarity: number,
  experienceScore: number
): number {
  const score = (cosineSimilarity * 0.7) + (experienceScore * 0.3);
  return Math.round(score * 100); // Expressed as 0 - 100 percentage integer
}

/**
 * Main Entry Point: Ranks all candidate applicants for a job in descending order of Final Score
 */
export function rankCandidates(
  job: JobRequirementsForRanking,
  candidates: CandidateProfileForRanking[]
): CandidateRankingResult[] {
  const jobRequiredSkills = extractJobRequiredSkills(job);
  const jobRequiredExperience = parseJobRequiredExperience(job);

  const rankedCandidates: CandidateRankingResult[] = candidates.map((candidate) => {
    const { similarity, matchedSkills, missingSkills } = calculateCosineSimilarity(
      jobRequiredSkills,
      candidate.skills
    );

    const experienceScore = calculateExperienceScore(
      candidate.experienceYears,
      jobRequiredExperience
    );

    const finalScore = calculateFinalScore(similarity, experienceScore);

    return {
      ...candidate,
      finalScore,
      cosineSimilarity: parseFloat(similarity.toFixed(4)),
      skillMatchPercentage: Math.round(similarity * 100),
      experienceScore: parseFloat(experienceScore.toFixed(4)),
      matchedSkills,
      missingSkills,
    };
  });

  // Sort candidates in descending order of Final Score
  rankedCandidates.sort((a, b) => b.finalScore - a.finalScore);

  return rankedCandidates;
}
