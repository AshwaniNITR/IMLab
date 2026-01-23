// app/vacancy/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Calendar,
  Clock,
  AlertCircle,
  MapPin,
  DollarSign,
  Mail,
  Briefcase,
  Building,
  Tag,
  CheckCircle,
} from "lucide-react";

interface Position {
  title: string;
  description: string;
  requirements: string[];
  type: "full-time" | "part-time" | "contract" | "internship";
  location: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  applicationDeadline: string;
  numberOfOpenings: number;
}

interface VacancyData {
  _id: string;
  content: string;
  isActive: boolean;
  expiryDate?: string;
  tags: string[];
  department: string;
  positions: Position[];
  contactEmail: string;
  applicationInstructions: string;
  createdAt: string;
  updatedAt: string;
}

export default function VacancyPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [vacancy, setVacancy] = useState<VacancyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    fetchVacancy();
  }, []);

  const fetchVacancy = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/getVac");

      if (!response.ok) {
        throw new Error("Failed to fetch vacancy information");
      }

      const data = await response.json();
      console.log("Fetched vacancy data:", data.data); // Debug log
      setVacancy(data.data || null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load vacancy information",
      );
      console.error("Error fetching vacancy:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEmploymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "full-time": "Full-time",
      "part-time": "Part-time",
      contract: "Contract",
      internship: "Internship",
    };
    return labels[type] || type;
  };

  const getEmploymentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "full-time": "bg-green-100 text-green-800 border-green-200",
      "part-time": "bg-blue-100 text-blue-800 border-blue-200",
      contract: "bg-purple-100 text-purple-800 border-purple-200",
      internship: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    const darkColors: Record<string, string> = {
      "full-time": "bg-green-900/30 text-green-300 border-green-800",
      "part-time": "bg-blue-900/30 text-blue-300 border-blue-800",
      contract: "bg-purple-900/30 text-purple-300 border-purple-800",
      internship: "bg-yellow-900/30 text-yellow-300 border-yellow-800",
    };
    return isDarkMode
      ? darkColors[type] || "bg-gray-700 text-gray-300"
      : colors[type] || "bg-gray-200 text-gray-700";
  };

  // Loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-96">
            <div
              className={`animate-spin rounded-full h-16 w-16 border-b-2 ${isDarkMode ? "border-orange-500" : "border-orange-500"}`}
            ></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
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
            Vacancy Announcements
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p
            className={`text-lg md:text-xl max-w-3xl mx-auto mb-8 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Explore current job openings and research opportunities in our lab
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div
              className={`rounded-xl border p-8 text-center ${
                isDarkMode
                  ? "bg-red-900/30 border-red-800"
                  : "bg-red-100 border-red-200"
              }`}
            >
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3
                className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Unable to Load Vacancy Information
              </h3>
              <p
                className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {error}
              </p>
              <button
                onClick={fetchVacancy}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                }`}
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Vacancy Content */}
        {vacancy && vacancy.content ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Main Vacancy Card */}
            <div
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                  : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
              }`}
            >
              {/* Header with Info */}
              <div
                className={`px-8 py-6 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-3 h-8 rounded-full bg-gradient-to-b from-orange-500 to-orange-600`}
                  ></div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Current Openings
                  </h2>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4">
                  {vacancy.department && (
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span>{vacancy.department}</span>
                    </div>
                  )}
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Posted: {formatDate(vacancy.createdAt)}</span>
                  </div>
                  {vacancy.expiryDate && (
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Expires: {formatDate(vacancy.expiryDate)}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {vacancy.tags && vacancy.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {vacancy.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          isDarkMode
                            ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                            : "bg-orange-100 text-orange-800 border border-orange-200"
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-8">
                <div
                  className={`prose max-w-none mb-8 ${
                    isDarkMode ? "prose-invert text-gray-300" : "text-gray-700"
                  }`}
                >
                  {vacancy.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph || <br />}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Positions */}
            {vacancy.positions && vacancy.positions.length > 0 && (
              <div className="space-y-6">
                <h3
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Available Positions ({vacancy.positions.length})
                </h3>

                {vacancy.positions.map((position, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                        : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
                    }`}
                  >
                    {/* Position Header */}
                    <div
                      className={`px-8 py-6 border-b ${
                        isDarkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h4
                            className={`text-xl font-bold mb-2 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {position.title}
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getEmploymentTypeColor(
                                position.type,
                              )}`}
                            >
                              <Briefcase className="w-3 h-3" />
                              {getEmploymentTypeLabel(position.type)}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                                isDarkMode
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <MapPin className="w-3 h-3" />
                              {position.location}
                            </span>
                            {position.numberOfOpenings > 1 && (
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                                  isDarkMode
                                    ? "bg-blue-900/30 text-blue-300"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {position.numberOfOpenings} openings
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Salary and Deadline */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {position.salaryRange && (
                          <div
                            className={`flex items-center gap-2 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            <DollarSign className="w-4 h-4" />
                            {position.salaryRange?.min &&
                            position.salaryRange?.max ? (
                              <span>
                                {position.salaryRange.min.toLocaleString()} -{" "}
                                {position.salaryRange.max.toLocaleString()}{" "}
                                {position.salaryRange.currency}
                              </span>
                            ) : (
                              <span>Salary not specified</span>
                            )}
                          </div>
                        )}
                        <div
                          className={`flex items-center gap-2 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                          <span>
                            Apply by: {formatDate(position.applicationDeadline)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Position Details */}
                    <div className="p-8">
                      {/* Description */}
                      <div className="mb-6">
                        <h5
                          className={`text-lg font-semibold mb-3 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Description
                        </h5>
                        <p
                          className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {position.description}
                        </p>
                      </div>

                      {/* Requirements */}
                      {position.requirements &&
                        position.requirements.length > 0 && (
                          <div>
                            <h5
                              className={`text-lg font-semibold mb-3 ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Requirements
                            </h5>
                            <ul className="space-y-2">
                              {position.requirements.map((req, reqIndex) => (
                                <li
                                  key={reqIndex}
                                  className={`flex items-start gap-3 ${
                                    isDarkMode
                                      ? "text-gray-300"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <CheckCircle
                                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                      isDarkMode
                                        ? "text-orange-400"
                                        : "text-orange-500"
                                    }`}
                                  />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Application Instructions */}
            <div
              className={`rounded-2xl p-6 ${
                isDarkMode
                  ? "bg-blue-900/30 border border-blue-800/50"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  className={`w-5 h-5 mt-0.5 ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <div className="flex-1">
                  <h4
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-blue-300" : "text-blue-800"
                    }`}
                  >
                    How to Apply
                  </h4>
                  <p
                    className={`mb-3 ${
                      isDarkMode ? "text-blue-200/80" : "text-blue-700"
                    }`}
                  >
                    {vacancy.applicationInstructions}
                  </p>
                  {vacancy.contactEmail && (
                    <div
                      className={`flex items-center gap-2 ${
                        isDarkMode ? "text-blue-300" : "text-blue-800"
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${vacancy.contactEmail}`}
                        className="font-medium hover:underline"
                      >
                        {vacancy.contactEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
                  : "bg-gradient-to-br from-white to-gray-50 border border-gray-200"
              }`}
            >
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div
                    className={`text-6xl mb-6 ${
                      isDarkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    📋
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-4 ${
                      isDarkMode ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    No Vacancies Available
                  </h3>
                  <p
                    className={`text-lg max-w-md mx-auto mb-8 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    We currently don't have any open positions. Please keep
                    checking our site for future opportunities.
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-300 border border-gray-700"
                        : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Last checked: {new Date().toLocaleDateString()}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
