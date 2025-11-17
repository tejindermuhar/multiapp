import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById, getFeedbackByInterviewId } from "@/lib/actions/interview.action";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export default async function FeedbackPage({ params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();
  
  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);
  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  if (!interview || !feedback) {
    redirect("/dashboard/interview");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-delayed-2"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/dashboard/interview" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Interviews</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm text-purple-700 rounded-full text-sm font-bold shadow-lg mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Interview Feedback
          </div>
          <h1 className="text-5xl font-extrabold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
              {interview.role}
            </span>
          </h1>
          <p className="text-xl text-gray-600">Your performance analysis</p>
        </div>

        {/* Total Score Card */}
        <div className="relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 text-center">
            <p className="text-gray-600 text-lg mb-2 font-semibold">Overall Score</p>
            <div className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-4">
              {feedback.totalScore}
            </div>
            <p className="text-gray-500">out of 100</p>
          </div>
        </div>

        {/* Category Scores */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Category Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {feedback.categoryScores.map((category, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                    <span className="text-3xl font-bold text-purple-600">{category.score}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                      style={{ width: `${category.score}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-600 text-sm">{category.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Strengths</h2>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-lg">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Areas for Improvement</h2>
            </div>
            <ul className="space-y-3">
              {feedback.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-gray-700 text-lg">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Final Assessment */}
        <div className="relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Final Assessment</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{feedback.finalAssessment}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/dashboard/interview/${id}`}>
            <Button variant="outline" className="w-full sm:w-auto border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50">
              View Interview Details
            </Button>
          </Link>
          <Link href={`/dashboard/interview/${id}/start`}>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Retake Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}