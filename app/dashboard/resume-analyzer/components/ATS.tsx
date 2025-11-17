// components/resume/ATS.tsx
import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

export default function ATS({ score, suggestions }: ATSProps) {
  const gradientClass = score > 69 ? "from-green-100" : score > 49 ? "from-yellow-100" : "from-red-100";
  const subtitle = score > 69 ? "Great Job!" : score > 49 ? "Good Start" : "Needs Improvement";

  return (
    <div className={`bg-gradient-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">{score > 69 ? "✓" : score > 49 ? "⚠" : "✗"}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">ATS Score - {score}/100</h2>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>
        <p className="text-gray-600 mb-4">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-lg">{suggestion.type === "good" ? "✓" : "⚠"}</span>
              <p className={suggestion.type === "good" ? "text-green-700" : "text-amber-700"}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-700 italic">
        Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>
    </div>
  );
}
