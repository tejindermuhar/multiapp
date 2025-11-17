import Link from "next/link";
import { Button } from "@/components/ui/button";
import InterviewCardClient from "@/app/dashboard/interview/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from "@/lib/actions/interview.action";

export default async function InterviewHomePage() {
  const user = await getCurrentUser();
  const [userInterviews, allInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  // Fetch feedback for user interviews
  const userInterviewsWithFeedback = await Promise.all(
    userInterviews.map(async (interview) => {
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user?.id!,
      });
      return { interview, feedback };
    })
  );

  // Fetch feedback for all interviews
  const allInterviewsWithFeedback = await Promise.all(
    allInterviews.map(async (interview) => {
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user?.id!,
      });
      return { interview, feedback };
    })
  );

  
  const hasPastInterviews = userInterviews?.length > 0;
  const hasPublicInterviews = allInterviews?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-delayed-2"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-delayed-4"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm text-purple-700 rounded-full text-sm font-semibold mb-6 shadow-md hover:shadow-lg transition-shadow">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Voice Agent Interview Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
              Get Interview-Ready
            </span>
            <br />
            <span className="text-gray-900">with AI</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Practice real interview questions & get instant feedback from our AI voice agent
          </p>

          {/* CTA Button */}
          <Link href="/dashboard/interview/create">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-10 py-7 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 group"
            >
              <svg className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start an Interview
            </Button>
          </Link>
        </div>

        {/* Your Interviews Section */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Interviews</h2>
              <p className="text-gray-600">Track your progress and review past sessions</p>
            </div>
            <Link href="/dashboard/interview/create">
              <Button 
                variant="outline" 
                className="gap-2 border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Interview
              </Button>
            </Link>
          </div>

          {hasPastInterviews ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userInterviewsWithFeedback?.map(({ interview, feedback }) => (
                <InterviewCardClient key={interview.id} interview={interview} feedback={feedback} />
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-10"></div>
              <div className="relative text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 hover:border-purple-400 transition-all">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-3">No interviews yet</p>
                <p className="text-gray-600 text-lg mb-6">Start your first interview to practice and improve</p>
                <Link href="/dashboard/interview/create">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Create Your First Interview
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Explore More Interviews */}
        <div>
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Explore More Interviews</h2>
            <p className="text-gray-600">Browse popular interview templates from the community</p>
          </div>

          {hasPublicInterviews ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allInterviewsWithFeedback?.map(({ interview, feedback }) => (
                <InterviewCardClient key={interview.id} interview={interview} feedback={feedback} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-xl text-gray-600">No public interviews available</p>
              <p className="text-gray-500 mt-2">Be the first to create and share an interview!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
