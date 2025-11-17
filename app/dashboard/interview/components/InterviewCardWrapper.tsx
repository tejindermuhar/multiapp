import { getFeedbackByInterviewId } from "@/lib/actions/interview.action";
import InterviewCard from "./InterviewCard";

interface InterviewCardWrapperProps {
  interview: Interview;
}

const InterviewCardWrapper = async ({ interview }: InterviewCardWrapperProps) => {
  const feedback = interview.userId
    ? await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: interview.userId,
      })
    : null;

  return <InterviewCard interview={interview} feedback={feedback} />;
};

export default InterviewCardWrapper;
