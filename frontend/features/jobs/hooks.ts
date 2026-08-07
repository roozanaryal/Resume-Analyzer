import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as jobsApi from "./api";
import { PostJobInput } from "./types";

export const usePostJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PostJobInput) => jobsApi.postJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useMyJobs = () => {
  return useQuery({
    queryKey: ["my-jobs"],
    queryFn: jobsApi.getMyJobs,
  });
};

export const useJobs = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () => jobsApi.getJobs(params),
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobsApi.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useSavedJobs = () => {
  return useQuery({
    queryKey: ["saved-jobs"],
    queryFn: jobsApi.getSavedJobs,
    retry: false,
  });
};

export const useToggleSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, isSaved }: { jobId: string; isSaved: boolean }) => {
      if (isSaved) {
        return jobsApi.deleteSavedJob(jobId);
      } else {
        return jobsApi.saveJob(jobId);
      }
    },
    onMutate: async ({ jobId, isSaved }) => {
      await queryClient.cancelQueries({ queryKey: ["saved-jobs"] });
      const previousSavedJobs = queryClient.getQueryData(["saved-jobs"]);

      queryClient.setQueryData(["saved-jobs"], (old: any) => {
        if (!old) return { savedJobs: [] };
        if (isSaved) {
          return {
            ...old,
            savedJobs: (old.savedJobs || []).filter(
              (sj: any) => String(sj.jobId || sj.job?.id) !== String(jobId)
            ),
          };
        } else {
          return {
            ...old,
            savedJobs: [
              ...(old.savedJobs || []),
              { jobId: String(jobId), job: { id: String(jobId) } },
            ],
          };
        }
      });

      return { previousSavedJobs };
    },
    onError: (err, variables, context) => {
      if (context?.previousSavedJobs) {
        queryClient.setQueryData(["saved-jobs"], context.previousSavedJobs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
  });
};

export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, resume }: { jobId: string; resume?: File | null }) =>
      jobsApi.applyToJob({ jobId, resume }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["job-application-status", variables.jobId],
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useJobApplicationStatus = (jobId: string) => {
  return useQuery({
    queryKey: ["job-application-status", jobId],
    queryFn: () => jobsApi.getJobApplicationStatus(jobId),
    enabled: !!jobId,
    retry: false,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: jobsApi.getDashboardStats,
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PostJobInput> }) =>
      jobsApi.updateJob({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
};

export const useJobApplicants = (jobId: string) => {
  return useQuery({
    queryKey: ["job-applicants", jobId],
    queryFn: () => jobsApi.getJobApplicants(jobId),
    enabled: !!jobId,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: string;
    }) => jobsApi.updateApplicationStatus({ applicationId, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-applicants"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
};
