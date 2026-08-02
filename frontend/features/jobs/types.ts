export interface PostJobInput {
  title: string;
  description: string;
  location: string;
  salaryRange?: string;
  type?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salaryRange?: string | null;
  type?: string | null;
  employerId: string;
  createdAt: string;
  employer?: {
    name?: string;
    email?: string;
    companyName?: string;
    companyWebsite?: string;
    companySize?: string;
    companyIndustry?: string;
    bio?: string;
  };
}
