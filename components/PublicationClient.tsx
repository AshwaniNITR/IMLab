// app/publications/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

interface PublicationItem {
  _id: string;
  title: string;
  author?: string;
  venue?: string;
  year: number;
  type: "Journal" | "Conference" | "book-chapter" | "patent";
  createdAt?: string;
  updatedAt?: string;
}

const typeLabels = {
  Journal: "Journal Publications",
  Conference: "Conference Papers",
  "book-chapter": "Book Chapters",
  patent: "Patents",
};

const typeColors = {
  Journal: "bg-gradient-to-r from-blue-500 to-blue-600",
  Conference: "bg-gradient-to-r from-purple-500 to-purple-600",
  "book-chapter": "bg-gradient-to-r from-amber-500 to-amber-600",
  patent: "bg-gradient-to-r from-green-500 to-green-600",
};

export default function PublicationsClient() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<
    PublicationItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const searchParams = useSearchParams();
  const router = useRouter();
  const initialType = searchParams.get("type");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Fetch all publications
  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects?limit=1000&sort=year:-1");

      if (!response.ok) {
        throw new Error("Failed to fetch publications");
      }

      const data = await response.json();

      // Fix TypeScript error: Properly type the sort function
      const sortedPublications = data.projects.sort(
        (a: PublicationItem, b: PublicationItem) => b.year - a.year
      );

      setPublications(sortedPublications);
      setFilteredPublications(sortedPublications);

      // Extract unique years - fix TypeScript error by explicitly typing
      // Extract unique years - fix TypeScript error
      const allYears = sortedPublications.map((p: PublicationItem) => p.year);
      // Extract unique years
      const uniqueYears = Array.from(
        new Set(sortedPublications.map((p: PublicationItem) => p.year))
      ).sort((a, b) => (b as number) - (a as number)) as number[];
      setYears(uniqueYears);

      // Set initial filter based on URL param
      if (
        initialType &&
        ["Journal", "Conference", "book-chapter", "patent"].includes(
          initialType
        )
      ) {
        setActiveFilter(initialType);
        const filtered = sortedPublications.filter(
          (p: PublicationItem) => p.type === initialType
        );
        setFilteredPublications(filtered);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load publications"
      );
      console.error("Error fetching publications:", err);
    } finally {
      setLoading(false);
    }
  }, [initialType]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  // Apply filters
  useEffect(() => {
    let filtered = publications;

    // Apply type filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((pub) => pub.type === activeFilter);
    }

    // Apply year filter
    if (selectedYear !== "all") {
      filtered = filtered.filter((pub) => pub.year === parseInt(selectedYear));
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pub) =>
          pub.title.toLowerCase().includes(query) ||
          (pub.author && pub.author.toLowerCase().includes(query)) ||
          (pub.venue && pub.venue.toLowerCase().includes(query))
      );
    }

    setFilteredPublications(filtered);
  }, [publications, activeFilter, selectedYear, searchQuery]);

  const clearFilters = () => {
    setActiveFilter("all");
    setSelectedYear("all");
    setSearchQuery("");
    setFilteredPublications(publications);
  };

  const getPublicationStats = () => {
    const stats = {
      total: publications.length,
      journal: publications.filter((p) => p.type === "Journal").length,
      conference: publications.filter((p) => p.type === "Conference").length,
      patent: publications.filter((p) => p.type === "patent").length,
      bookChapter: publications.filter((p) => p.type === "book-chapter").length,
    };
    return stats;
  };

  const stats = getPublicationStats();

  // Loading skeleton
  if (loading) {
    return (
      <div
        className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-96">
            <div
              className={`animate-spin rounded-full h-16 w-16 border-b-2 ${
                isDarkMode ? "border-orange-500" : "border-orange-500"
              }`}
            ></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent`}
          >
            Publications
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p
            className={`text-lg md:text-xl max-w-3xl mx-auto mb-8 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Explore our research contributions across journals, conferences,
            patents, and book chapters
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-8">
            <div
              className={`text-center p-4 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                  : "bg-gradient-to-br from-gray-50 to-white border border-gray-200"
              }`}
            >
              <div
                className={`text-2xl md:text-3xl font-bold ${
                  isDarkMode ? "text-orange-400" : "text-orange-600"
                }`}
              >
                {stats.total}
              </div>
              <div
                className={`text-sm mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total
              </div>
            </div>

            <div
              className={`text-center p-4 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                  : "bg-gradient-to-br from-gray-50 to-white border border-gray-200"
              }`}
            >
              <div
                className={`text-2xl md:text-3xl font-bold ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {stats.journal}
              </div>
              <div
                className={`text-sm mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Journal
              </div>
            </div>

            <div
              className={`text-center p-4 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                  : "bg-gradient-to-br from-gray-50 to-white border border-gray-200"
              }`}
            >
              <div
                className={`text-2xl md:text-3xl font-bold ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              >
                {stats.conference}
              </div>
              <div
                className={`text-sm mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Conference
              </div>
            </div>

            <div
              className={`text-center p-4 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                  : "bg-gradient-to-br from-gray-50 to-white border border-gray-200"
              }`}
            >
              <div
                className={`text-2xl md:text-3xl font-bold ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {stats.patent}
              </div>
              <div
                className={`text-sm mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Patent
              </div>
            </div>

            <div
              className={`text-center p-4 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50"
                  : "bg-gradient-to-br from-gray-50 to-white border border-gray-200"
              }`}
            >
              <div
                className={`text-2xl md:text-3xl font-bold ${
                  isDarkMode ? "text-amber-400" : "text-amber-600"
                }`}
              >
                {stats.bookChapter}
              </div>
              <div
                className={`text-sm mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Book Chapter
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div
              className={`rounded-xl border p-8 text-center ${
                isDarkMode
                  ? "bg-red-900/30 border-red-800"
                  : "bg-red-100 border-red-200"
              }`}
            >
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Unable to Load Publications
              </h3>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {error}
              </p>
              <button
                onClick={fetchPublications}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                }`}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mb-10 p-6 rounded-2xl transition-all duration-300 ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50"
              : "bg-gradient-to-br from-gray-50 to-white border border-gray-200"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Type Filter */}
            <div>
              <label
                className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Filter by Type
              </label>
              <div className="flex flex-wrap gap-2">
                {["all", "Journal", "Conference", "patent", "book-chapter"].map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setActiveFilter(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeFilter === type
                          ? type === "all"
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                            : typeColors[type as keyof typeof typeColors] +
                              " text-white"
                          : isDarkMode
                          ? "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                      }`}
                    >
                      {type === "all"
                        ? "All Types"
                        : typeLabels[type as keyof typeof typeLabels]}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label
                className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Filter by Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800/50 border border-gray-700/50 text-gray-300 focus:border-orange-500/50 focus:ring-orange-500/30"
                    : "bg-white border border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-orange-500/20"
                }`}
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Filter */}
            <div>
              <label
                className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Search Publications
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, authors, or venue..."
                  className={`flex-1 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800/50 border border-gray-700/50 text-gray-300 placeholder-gray-500 focus:border-orange-500/50 focus:ring-orange-500/30"
                      : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20"
                  }`}
                />
                {(activeFilter !== "all" ||
                  selectedYear !== "all" ||
                  searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
                        : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`mb-6 px-4 py-3 rounded-lg transition-all duration-300 ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50"
              : "bg-gradient-to-br from-gray-50 to-white border border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span
                className={`font-medium transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Showing {filteredPublications.length} of {publications.length}{" "}
                publications
                {activeFilter !== "all" &&
                  ` in ${typeLabels[activeFilter as keyof typeof typeLabels]}`}
                {selectedYear !== "all" && ` from ${selectedYear}`}
              </span>
            </div>
            {filteredPublications.length === 0 && publications.length > 0 && (
              <button
                onClick={clearFilters}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode
                    ? "text-orange-400 hover:text-orange-300"
                    : "text-orange-600 hover:text-orange-500"
                }`}
              >
                Clear filters to see all publications
              </button>
            )}
          </div>
        </motion.div>

        {/* Publications List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          {filteredPublications.length > 0 ? (
            filteredPublications.map((publication, index) => (
              <motion.div
                key={publication._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                className={`group rounded-xl overflow-hidden transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 hover:border-orange-500/30"
                    : "bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-orange-500/30"
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Left: Type indicator and year */}
                    <div className="lg:w-1/6">
                      <div className="flex flex-col items-center lg:items-start space-y-3">
                        <div
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            typeColors[publication.type]
                          } text-white`}
                        >
                          {publication.type}
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            isDarkMode ? "text-orange-400" : "text-orange-600"
                          }`}
                        >
                          {publication.year}
                        </div>
                      </div>
                    </div>

                    {/* Right: Publication details */}
                    <div className="lg:w-5/6">
                      {/* Title */}
                      <h3
                        className={`text-xl font-bold mb-3 group-hover:underline transition-all duration-300 ${
                          isDarkMode
                            ? "text-white group-hover:text-orange-300"
                            : "text-gray-900 group-hover:text-orange-600"
                        }`}
                      >
                        {publication.title}
                      </h3>

                      {/* Authors */}
                      {publication.author && (
                        <div className="mb-3">
                          <span
                            className={`text-sm font-medium transition-colors duration-300 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Authors:
                          </span>
                          <span
                            className={`text-sm ml-2 transition-colors duration-300 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {publication.author}
                          </span>
                        </div>
                      )}

                      {/* Venue */}
                      {publication.venue && (
                        <div className="mb-4">
                          <span
                            className={`text-sm font-medium transition-colors duration-300 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Published in:
                          </span>
                          <span
                            className={`text-sm ml-2 transition-colors duration-300 ${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {publication.venue}
                          </span>
                        </div>
                      )}

                      {/* Additional info */}
                      <div
                        className={`flex flex-wrap gap-4 text-xs transition-colors duration-300 ${
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${typeColors[
                              publication.type
                            ].replace("bg-", "bg-")}`}
                          ></div>
                          <span>{typeLabels[publication.type]}</span>
                        </div>
                        {publication.updatedAt && (
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                isDarkMode ? "bg-gray-600" : "bg-gray-400"
                              }`}
                            ></div>
                            <span>
                              Updated:{" "}
                              {new Date(
                                publication.updatedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div
              className={`text-center py-16 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50"
                  : "bg-gradient-to-br from-gray-50 to-white border border-gray-200"
              }`}
            >
              <div className="text-4xl mb-4">📚</div>
              <h3
                className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                No publications found
              </h3>
              <p
                className={`mb-6 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {publications.length === 0
                  ? "No publications have been added yet."
                  : "Try adjusting your filters or search term."}
              </p>
              {publications.length > 0 && (
                <button
                  onClick={clearFilters}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  }`}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
