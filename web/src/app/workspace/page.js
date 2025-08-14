"use client";

import { useState } from "react";
import Link from "next/link";

export default function WorkspacePage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!resumeFile || !jobDescription) {
      setError("Please upload a resume and paste the job description.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jd", jobDescription);

      const res = await fetch("http://127.0.0.1:8000/api/match", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-700">
            MatchMyResume
          </Link>
          <div className="text-sm text-gray-500">Workspace</div>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-semibold mb-6 text-blue-700 text-center">
              AI Resume Matcher
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume (PDF or DOCX)
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  className="w-full border border-gray-300 bg-white p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-700 file:text-white hover:file:bg-blue-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Job Description
                </label>
                <textarea
                  placeholder="Paste job description here..."
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full border border-gray-300 bg-white p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700 transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Match Resume"
                )}
              </button>
            </form>

            {error && (
              <p className="text-red-600 mt-4 bg-red-50 p-3 rounded-md text-center">
                {error}
              </p>
            )}

            {result && (
              <div className="mt-6 bg-white p-6 rounded-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-blue-700">
                  Results
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <p className="bg-gray-50 p-3 rounded-md">
                    <strong className="text-blue-700">
                      Match Score (Keyword Based):
                    </strong>{" "}
                    {result.matchScore}
                  </p>
                  <p className="bg-gray-50 p-3 rounded-md">
                    <strong className="text-blue-700">AI Score:</strong>{" "}
                    {result.aiScore}
                  </p>
                </div>

                {Array.isArray(result.missingKeywords) &&
                  result.missingKeywords.length > 0 && (
                    <div className="mt-4">
                      <strong className="text-blue-700">
                        Missing Keywords:
                      </strong>
                      <ul className="list-disc ml-6 text-red-600 mt-2">
                        {result.missingKeywords.map((kw, idx) => (
                          <li key={idx} className="py-1">
                            {kw}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {Array.isArray(result.suggestions) &&
                  result.suggestions.length > 0 && (
                    <div className="mt-4">
                      <strong className="text-blue-700">AI Suggestions:</strong>
                      <ul className="list-disc ml-6 text-green-600 mt-2">
                        {result.suggestions.map((sug, idx) => (
                          <li key={idx} className="py-1">
                            {sug}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-block px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              ← Back to Landing
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
