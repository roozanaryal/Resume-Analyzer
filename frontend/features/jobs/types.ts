export interface PostJobInput {
  title: string;
  description: string;
  location: string;
  salaryRange?: string;
  type?: string;
  skillsRequired?: string;
  experienceRequired?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryRange?: string | null;
  type?: string | null;
  skillsRequired?: string | null;
  experienceRequired?: string | null;
  employerId: string;
  createdAt: string;
  employer?: {
    id?: string;
    name?: string;
    email?: string;
    companyName?: string;
    companyWebsite?: string;
    companySize?: string;
    companyIndustry?: string;
    bio?: string;
  };
}
