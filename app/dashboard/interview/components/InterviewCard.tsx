"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { cn, getInterviewGradient } from "@/lib/utils";

interface InterviewCardProps {
  interview: Interview;
  feedback?: Feedback | null;
}

const InterviewCard = ({ interview, feedback }: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;
  const badgeColor = {
    Behavioral: "bg-blue-500 text-white",
    Mixed: "bg-purple-500 text-white",
    Technical: "bg-green-500 text-white",
  }[normalizedType] || "bg-gray-500 text-white";

  const formattedDate = dayjs(feedback?.createdAt || interview.createdAt || Date.now()).format(
    "MMM D, YYYY"
  );

  const gradientClass = getInterviewGradient(interview.type, interview.role);

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
      {/* Beautiful Dynamic Gradient Cover */}
      <div className={`relative h-48 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
        {/* Animated mesh pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        </div>
        
        {/* Floating shapes with animation */}
        <div className="absolute top-6 right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-6 left-6 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Score badge - positioned on gradient */}
        {feedback && (
          <div className="absolute top-4 right-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 blur-lg rounded-2xl"></div>
              <div className="relative bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {feedback.totalScore}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Score</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and badges */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {interview.role || "Interview"}
          </h3>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm", badgeColor)}>
              {normalizedType}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Tech Stack */}
        {interview.techstack && interview.techstack.length > 0 && (
          <div className="mb-5 pb-5 border-b border-gray-100">
            {/* <DisplayTechIcons techstack={interview.techstack} /> */}
            {interview.techstack}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
          {feedback?.finalAssessment ||
            "You haven't taken this interview yet. Take it now to improve your skills."}
        </p>

        {/* Action Button - FIXED WHITE TEXT */}
        <Link href={`/dashboard/interview/${interview.id}`} className="block">
          <Button className="w-full h-12 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all group-hover:scale-[1.02]">
            <span className="flex items-center justify-center gap-2">
              View Interview
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
