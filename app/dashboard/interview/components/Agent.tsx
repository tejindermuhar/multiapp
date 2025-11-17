"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/interview.action";
import { toast } from "sonner";

type Message = {
  type: string;
  transcriptType?: string;
  role: "user" | "assistant" | "system";
  transcript?: string;
  content?: string;
};

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

type SavedMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};
 
const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: {
  userName: string;
  userId: string;
  interviewId: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  
  const feedbackGeneratedRef = useRef(false);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => {
      console.log("Call ended, messages:", messages.length);
      setCallStatus(CallStatus.FINISHED);
    };
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { 
          role: message.role, 
          content: message.transcript || "" 
        };
        console.log("New message:", newMessage);
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => {
      console.error("Vapi Error:", error);
      toast.error("An error occurred during the interview");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  useEffect(() => {
    const handleGenerateFeedback = async () => {
      // Prevent duplicate calls with ref
      if (feedbackGeneratedRef.current || isGeneratingFeedback) {
        console.log("⚠️ Feedback generation already in progress or completed");
        return;
      }

      // Mark as started
      feedbackGeneratedRef.current = true;
      setIsGeneratingFeedback(true);
      
      console.log("Generating feedback with messages:", messages.length);

      if (messages.length === 0) {
        console.warn("No messages to generate feedback from");
        toast.error("No interview transcript available");
        router.push("/dashboard/interview");
        return;
      }

      try {
        toast.loading("Generating your feedback...");
        
        const { success, feedbackId: id, error } = await createFeedback({
          interviewId: interviewId!,
          userId: userId!,
          transcript: messages,
          feedbackId,
        });

        toast.dismiss();

        if (success && id) {
          toast.success("Feedback generated successfully!");
          console.log("✅ Feedback generated successfully, redirecting...");
          router.push(`/dashboard/interview/${interviewId}/feedback`);
        } else {
          console.error("❌ Feedback generation failed:", { success, id, error });
          toast.error(`Failed to generate feedback: ${error || "Unknown error"}`);
          router.push("/dashboard/interview");
        }
      } catch (error) {
        console.error("❌ Error generating feedback:", error);
        toast.error("An error occurred while generating feedback");
        router.push("/dashboard/interview");
      } finally {
        setIsGeneratingFeedback(false);
      }
    };

    if (callStatus === CallStatus.FINISHED && !feedbackGeneratedRef.current && !isGeneratingFeedback) {
      if (type === "generate") {
        router.push("/dashboard/interview");
      } else {
        // Add a small delay to ensure all messages are captured
        setTimeout(() => {
          handleGenerateFeedback();
        }, 1000);
      }
    }
  }, [callStatus, feedbackId, interviewId, router, type, userId, messages, isGeneratingFeedback]);

  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);
      setMessages([]); // Clear previous messages
      feedbackGeneratedRef.current = false; // Reset ref
      
      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: { username: userName, userid: userId },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions.map((q) => `- ${q}`).join("\n");
        }
        await vapi.start(interviewer, {
          variableValues: { questions: formattedQuestions },
        });
      }
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Failed to start interview");
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    console.log("Disconnecting call, messages captured:", messages.length);
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="space-y-8">
      {/* Loading Overlay for Feedback Generation */}
      {isGeneratingFeedback && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Performance</h3>
            <p className="text-gray-600">Please wait while we generate your feedback...</p>
          </div>
        </div>
      )}

      {/* Header Badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-sm text-purple-700 rounded-full text-sm font-bold shadow-lg mb-4">
          <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          {callStatus === "ACTIVE" ? "Interview in Progress" : callStatus === "CONNECTING" ? "Connecting..." : callStatus === "FINISHED" ? "Interview Completed" : "Ready to Start"}
        </div>
      </div>

      {/* Video Call Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* AI Interviewer Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className={cn(
                  "absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 transition-opacity",
                  isSpeaking && "animate-pulse"
                )}></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src="/ai-avatar.png"
                    alt="AI Interviewer"
                    fill
                    className="object-cover"
                  />
                </div>
                {isSpeaking && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      <span className="text-xs font-bold text-white">Speaking</span>
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Interviewer</h3>
              <p className="text-gray-600 text-center">Your virtual interview coach</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Image
                    src="/user-avatar.png"
                    alt={userName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{userName}</h3>
              <p className="text-gray-600 text-center">Candidate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Display */}
      {messages.length > 0 && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Live Transcript</h3>
              </div>
              <span className="text-sm text-gray-500">{messages.length} messages</span>
            </div>
            <p className="text-gray-800 text-lg leading-relaxed animate-fadeIn">
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Call Control Button */}
      <div className="flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button
            onClick={handleCall}
            disabled={callStatus === "CONNECTING" || callStatus === "FINISHED"}
            className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-full font-bold text-xl shadow-2xl transform group-hover:scale-105 transition-all disabled:transform-none">
              {callStatus === "CONNECTING" ? (
                <>
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Connecting...
                </>
              ) : callStatus === "FINISHED" ? (
                <>
                  <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Start Interview
                </>
              )}
            </div>
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-red-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative flex items-center gap-3 px-12 py-6 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-xl shadow-2xl transform group-hover:scale-105 transition-all">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
              End Interview
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;
