import Agent from "../../components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewById,
  getFeedbackByInterviewId,
} from "@/lib/actions/interview.action";
import { redirect } from "next/navigation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export default async function StartInterviewPage({ params }: RouteParams) {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview || !user) {
    redirect("/dashboard/interview");
  }

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  // Type guard function to validate interview type
  const getValidInterviewType = (type: string): "interview" | "generate" => {
    return type === "interview" || type === "generate" ? type : "interview";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-delayed-2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-delayed-4"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Agent
          userName={user.name}
          userId={user.id}
          interviewId={id}
          feedbackId={feedback?.id}
          type={getValidInterviewType(interview.type)}
          questions={interview.questions}
        />
      </div>
    </div>
  );
}
