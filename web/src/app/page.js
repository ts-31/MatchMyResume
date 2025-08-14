import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">MatchMyResume</h1>
          <nav className="flex space-x-6">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-700 transition font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-700 transition font-medium"
            >
              How It Works
            </a>
            <Link
              href="/workspace"
              className="text-gray-600 hover:text-blue-700 transition font-medium"
            >
              Try Analyzer
            </Link>
            <Link
              href="/workspace"
              className="text-gray-600 hover:text-blue-700 transition font-medium"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
            Optimize Your Resume with{" "}
            <span className="text-blue-700">MatchMyResume</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Boost your job application success with AI-powered resume analysis.
            Upload your resume, paste a job description, and get tailored
            insights.
          </p>
          <Link
            href="/workspace"
            className="inline-block bg-blue-700 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-800 transition duration-300"
          >
            Try It Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose MatchMyResume?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📄",
                title: "Resume Upload",
                desc: "Upload your resume in PDF or DOCX format for instant analysis.",
              },
              {
                icon: "🔍",
                title: "Job Description Analysis",
                desc: "Paste or scrape job details, then analyze instantly.",
              },
              {
                icon: "📊",
                title: "Match Score",
                desc: "Get a clear score based on keyword overlap with the JD.",
              },
              {
                icon: "🤖",
                title: "AI Suggestions",
                desc: "Actionable recommendations powered by your LLM backend.",
              },
              {
                icon: "🧠",
                title: "Free to Start",
                desc: "Begin improving your resume at no cost.",
              },
              {
                icon: "🌐",
                title: "Chrome Extension",
                desc: "Use it on LinkedIn/Internshala with the companion extension.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="text-blue-700 text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Zigzag */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="space-y-16">
            {[
              {
                step: "1. Upload Your Resume",
                desc: "Upload your resume (PDF/DOCX) using the web app or extension.",
              },
              {
                step: "2. Paste Job Description",
                desc: "Paste the JD or scrape it from supported sites.",
              },
              {
                step: "3. Get AI Insights",
                desc: "See match score, missing keywords, and suggestions.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  i % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                    {s.step}
                  </h3>
                  <p className="text-gray-600">{s.desc}</p>
                </div>
                <div className="md:w-1/2">
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Placeholder</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/workspace"
              className="inline-block bg-blue-700 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-800 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} MatchMyResume. MIT License.
          </p>
        </div>
      </footer>
    </div>
  );
}
