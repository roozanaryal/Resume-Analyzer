import { api } from "@/lib/axios";
import { Job, PostJobInput } from "./types";

export const postJob = async (data: PostJobInput): Promise<Job> => {
  const response = await api.post("/jobs/post", data);
  return response.data.job;
};

export const getMyJobs = async (): Promise<Job[]> => {
  const response = await api.get("/jobs/my-jobs");
  return response.data.jobs;
};

export const getJobs = async (params?: Record<string, any>) => {
  const response = await api.get("/jobs", { params });
  return response.data;
};

export const getJobById = async (id: string): Promise<Job> => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await api.delete(`/jobs/${id}`);
};

export const getSavedJobs = async () => {
  const response = await api.get("/jobs/saved");
  return response.data;
};

export const saveJob = async (jobId: string) => {
  const response = await api.post(`/jobs/save/${jobId}`);
  return response.data;
};

export const deleteSavedJob = async (jobId: string) => {
  const response = await api.delete(`/jobs/saved/${jobId}`);
  return response.data;
};

export const applyToJob = async ({
  jobId,
  resume,
}: {
  jobId: string;
  resume?: File | null;
}) => {
  const formData = new FormData();
  if (resume) {
    formData.append("resume", resume);
  }

  const response = await api.post(`/jobs/apply/${jobId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getJobApplicationStatus = async (jobId: string) => {
  const response = await api.get(`/jobs/apply/status/${jobId}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get("/jobs/dashboard-stats");
  return response.data;
};

export const updateJob = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<PostJobInput>;
}) => {
  const response = await api.put(`/jobs/${id}`, data);
  return response.data;
};

export const getJobApplicants = async (jobId: string) => {
  const response = await api.get(`/jobs/${jobId}/applicants`);
  return response.data;
};

export const updateApplicationStatus = async ({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) => {
  const response = await api.put(`/jobs/application/${applicationId}/status`, {
    status,
  });
  return response.data;
};
