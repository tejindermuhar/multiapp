import InterviewForm from "@/app/dashboard/interview/components/InterviewForm";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function CreateInterviewPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-delayed-2"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-delayed-4"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Badge */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-purple-700 rounded-full text-sm font-semibold mb-4 shadow-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            AI Interview Practice
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
              Create New Interview
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Set up your interview parameters and get AI-generated questions
          </p>
        </div>

        {/* Main Form Card with Glow Effect */}
        <div className="relative mb-12">
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-25"></div>
          
          {/* Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
            <InterviewForm userId={user.id} userName={user.name} />
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-purple-100 hover:border-purple-300 transition-all hover:shadow-lg group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Smart Questions</h3>
            <p className="text-sm text-gray-600">AI generates role-specific questions tailored to your needs</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-pink-100 hover:border-pink-300 transition-all hover:shadow-lg group">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Voice Practice</h3>
            <p className="text-sm text-gray-600">Realistic voice AI simulates actual interview conversations</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Get Feedback</h3>
            <p className="text-sm text-gray-600">Receive detailed analysis and improvement suggestions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
