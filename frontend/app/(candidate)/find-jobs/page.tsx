"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, ChevronDown, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import JobCard, { Job } from "@/components/JobCard";
import SalaryRangeSlider from "@/components/SalaryRangeSlider";
import { useJobs, useSavedJobs, useToggleSaveJob } from "@/features/jobs/hooks";
import { useDebounce } from "@/hooks/use-debounce";

const ITEMS_PER_PAGE = 8;

export default function FindJobsPage() {
  const [appliedJobs, setAppliedJobs] = useState<(string | number)[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const [jobTypeFilters, setJobTypeFilters] = useState<Record<string, boolean>>({
    Remote: false,
    "Full-Time": false,
    "Part-Time": false,
    Contract: false,
    Internship: false,
  });

  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 100 });
  const [expandedFilters, setExpandedFilters] = useState({
    jobType: true,
    salary: true,
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate selected types for backend query
  const selectedTypes = Object.keys(jobTypeFilters).filter((key) => jobTypeFilters[key]);
  const activeTypeFilter = selectedTypes.length === 1 ? selectedTypes[0] : undefined;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedLocation = useDebounce(location, 500);

  // Fetch jobs and saved jobs from backend
  const { data: jobsData, isLoading: isJobsLoading, isError } = useJobs({
    search: debouncedSearchQuery || undefined,
    location: debouncedLocation || undefined,
    type: activeTypeFilter,
    limit: 1000,
  });

  const { data: savedJobsData } = useSavedJobs();
  const toggleSaveMutation = useToggleSaveJob();

  // Extract saved job IDs from backend response
  const savedJobIds: string[] = (savedJobsData?.savedJobs || []).map(
    (sj: any) => String(sj.jobId || sj.job?.id)
  );

  // Map backend jobs to component format
  const rawJobs = jobsData?.jobs || [];
  const mappedJobs: Job[] = rawJobs.map((j: any) => {
    const companyName = j.employer?.companyName || j.employer?.name || "Tech Company";
    const formattedDate = j.createdAt
      ? new Date(j.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Recently";

    return {
      id: j.id,
      title: j.title,
      company: companyName,
      location: j.location,
      type: j.type || "Full-Time",
      category: "Software & Tech",
      date: formattedDate,
      salary: j.salaryRange || "Competitive",
      logo: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(companyName)}&backgroundColor=0284c7`,
      skillsRequired: j.skillsRequired,
    };
  });

  // Client-side additional filtering (for multi-type or salary range client refinement)
  const filteredJobs = mappedJobs.filter((job) => {
    const matchesTitle =
      !debouncedSearchQuery ||
      job.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

    const matchesLocation =
      !debouncedLocation || job.location.toLowerCase().includes(debouncedLocation.toLowerCase());

    const hasSelectedTypes = Object.values(jobTypeFilters).some((v) => v);
    const matchesType =
      !hasSelectedTypes ||
      Object.keys(jobTypeFilters).some(
        (type) =>
          jobTypeFilters[type as keyof typeof jobTypeFilters] &&
          job.type.toLowerCase() === type.toLowerCase()
      );

    const matchesSalary = (() => {
      if (salaryRange.min === 0 && salaryRange.max === 100) return true;
      if (!job.salary || job.salary.toLowerCase() === "competitive") return true;

      const matches = job.salary.match(/\d+[\d,.]*/g);
      if (!matches || matches.length === 0) return true;

      const nums = matches.map((m) => {
        let n = parseFloat(m.replace(/,/g, ""));
        if (n >= 1000) n = Math.round(n / 1000);
        return n;
      });

      const jobMin = Math.min(...nums);
      const jobMax = Math.max(...nums);

      return jobMax >= salaryRange.min && jobMin <= salaryRange.max;
    })();

    return matchesTitle && matchesLocation && matchesType && matchesSalary;
  });

  // Reset to first page when search filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, location, jobTypeFilters, salaryRange]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSaveJob = (id: string | number) => {
    const isSaved = savedJobIds.includes(String(id));
    toggleSaveMutation.mutate({ jobId: String(id), isSaved });
  };

  const toggleApplyJob = (id: string | number) => {
    setAppliedJobs((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setJobTypeFilters({
      Remote: false,
      "Full-Time": false,
      "Part-Time": false,
      Contract: false,
      Internship: false,
    });
    setSalaryRange({ min: 0, max: 100 });
    setSearchQuery("");
    setLocation("");
  };

  const handleJobTypeChange = (type: string) => {
    const newFilters = {
      ...jobTypeFilters,
      [type]: !jobTypeFilters[type as keyof typeof jobTypeFilters],
    };
    setJobTypeFilters(newFilters);
  };

  const toggleFilterExpand = (filterName: "jobType" | "salary") => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  return (
    <>
      {/* Search Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8 sm:mb-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-3xl -mr-16 -mt-16" />

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          Find Your Dream Job
        </h1>
        <p className="text-gray-600 font-medium mb-6 sm:mb-8 text-sm sm:text-base">
          Discover opportunities that match your passion
        </p>

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Job title or keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm sm:text-base"
            />
          </div>
          <div className="flex-1 relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm sm:text-base"
            />
          </div>
          <button
            onClick={() => {}}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 active:scale-95 transition-all text-sm sm:text-base cursor-pointer"
          >
            Search Jobs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Filter Jobs
            </h2>
            <button
              onClick={handleClearAll}
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Job Type */}
          <div className="space-y-4">
            <button
              onClick={() => toggleFilterExpand("jobType")}
              className="flex items-center justify-between cursor-pointer group w-full"
            >
              <span className="font-bold text-gray-700 text-sm sm:text-base">
                Job Type
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${expandedFilters.jobType ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.jobType && (
              <div className="space-y-3 pl-1 text-sm font-medium text-gray-700">
                {[
                  "Remote",
                  "Full-Time",
                  "Part-Time",
                  "Contract",
                  "Internship",
                ].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer hover:text-gray-900 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={
                        jobTypeFilters[type as keyof typeof jobTypeFilters] ||
                        false
                      }
                      onChange={() => handleJobTypeChange(type)}
                      className="h-4 w-4 rounded border-gray-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    {type}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-gray-100" />

          {/* Salary Range */}
          <div className="space-y-4">
            <button
              onClick={() => toggleFilterExpand("salary")}
              className="flex items-center justify-between cursor-pointer group w-full"
            >
              <span className="font-bold text-gray-700 text-sm sm:text-base">
                Salary Range
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${expandedFilters.salary ? "rotate-180" : ""}`}
              />
            </button>
            {expandedFilters.salary && (
              <SalaryRangeSlider
                min={salaryRange.min}
                max={salaryRange.max}
                minLimit={0}
                maxLimit={100}
                onChange={(values) => setSalaryRange(values)}
              />
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          {/* Loading state */}
          {isJobsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500 font-medium">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span>Loading jobs...</span>
            </div>
          ) : (
            <>
              {/* Job Grid */}
              <div
                className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2"
              >
                {paginatedJobs.length > 0 ? (
                  paginatedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobIds.includes(String(job.id))}
                      onSaveToggle={toggleSaveJob}
                      onApply={toggleApplyJob}
                      isApplied={
                        appliedJobs.includes(job.id) || job.status === "Applied"
                      }
                      view="grid"
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <p className="text-gray-500 font-semibold">
                      No jobs found. Try adjusting your search or filters.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                    <div>
                      <nav className="relative z-0 inline-flex rounded-2xl shadow-sm -space-x-px bg-white border border-gray-100 p-1 gap-1" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                              currentPage === page
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}

