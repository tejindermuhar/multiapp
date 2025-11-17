"use server";

import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "",
    "X-Title": "Mock Interview AI",
  },
});

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    console.log("📝 Creating feedback for interview:", interviewId);
    console.log("📊 Transcript length:", transcript?.length || 0);

    if (!interviewId || !userId) {
      return { success: false, error: "Missing required fields" };
    }

    if (!transcript || transcript.length === 0) {
      return { success: false, error: "No interview transcript available" };
    }

    // Check if feedback already exists for this interview
    const supabase = await createClient();
    const { data: existingFeedback } = await supabase
      .from("feedback")
      .select("id")
      .eq("interview_id", interviewId)
      .eq("user_id", userId)
      .single();

    if (existingFeedback && !feedbackId) {
      console.log("✅ Feedback already exists, skipping generation");
      return { success: true, feedbackId: existingFeedback.id };
    }

    const formattedTranscript = transcript
      .map((sentence: { role: string; content: string }) =>
        `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    console.log("🤖 Calling OpenRouter for feedback generation...");

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional interviewer analyzing a mock interview. Return only valid JSON.",
        },
        {
          role: "user",
          content: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate.

Transcript:
${formattedTranscript}

Return JSON:
{
  "totalScore": number,
  "categoryScores": [
    { "name": "Communication Skills", "score": number, "comment": "detailed comment" },
    { "name": "Technical Knowledge", "score": number, "comment": "detailed comment" },
    { "name": "Problem-Solving", "score": number, "comment": "detailed comment" },
    { "name": "Cultural & Role Fit", "score": number, "comment": "detailed comment" },
    { "name": "Confidence & Clarity", "score": number, "comment": "detailed comment" }
  ],
  "strengths": [],
  "areasForImprovement": [],
  "finalAssessment": ""
}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    console.log("✅ OpenRouter response received");

    const content = completion.choices[0].message.content;
    if (!content) {
      return { success: false, error: "No response from AI" };
    }

    const object = JSON.parse(content);
    console.log("📊 Parsed feedback:", { totalScore: object.totalScore });

    const feedbackData = {
      interview_id: interviewId,
      user_id: userId,
      total_score: object.totalScore,
      category_scores: object.categoryScores,
      strengths: object.strengths,
      areas_for_improvement: object.areasForImprovement,
      final_assessment: object.finalAssessment,
      created_at: new Date().toISOString(),
    };

    if (feedbackId) {
      console.log("🔄 Updating existing feedback:", feedbackId);
      const { error } = await supabase
        .from("feedback")
        .update(feedbackData)
        .eq("id", feedbackId);

      if (error) {
        console.error("❌ Database update error:", error);
        throw error;
      }
      console.log("✅ Feedback updated successfully");
      return { success: true, feedbackId };
    } else {
      console.log("➕ Creating new feedback");
      const { data, error } = await supabase
        .from("feedback")
        .insert(feedbackData)
        .select("id")
        .single();

      if (error) {
        console.error("❌ Database insert error:", error);
        throw error;
      }
      console.log("✅ Feedback created successfully:", data.id);
      return { success: true, feedbackId: data.id };
    }
  } catch (error: any) {
    console.error("❌ Error in createFeedback:", error);

    if (typeof error?.message === "string") {
      if (error.message.includes("429")) {
        return { success: false, error: "Quota exceeded on OpenRouter." };
      }
      if (error.message.includes("401")) {
        return { success: false, error: "Invalid OpenRouter API key" };
      }
      return { success: false, error: error.message };
    }

    return { success: false, error: "Unknown error occurred" };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("interviews")
      .select("*")
      .eq("id", id)
      .single();

    if (!data) return null;

    return {
      id: data.id,
      role: data.role,
      type: data.type,
      level: data.level,
      techstack: data.techstack,
      questions: data.questions,
      userId: data.user_id,
      finalized: data.finalized,
      coverImage: data.cover_image,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  try {
    const { interviewId, userId } = params;
    const supabase = await createClient();
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .eq("interview_id", interviewId)
      .eq("user_id", userId)
      .single();

    if (!data) return null;

    return {
      id: data.id,
      interviewId: data.interview_id,
      userId: data.user_id,
      totalScore: data.total_score,
      categoryScores: data.category_scores,
      strengths: data.strengths,
      areasForImprovement: data.areas_for_improvement,
      finalAssessment: data.final_assessment,
      createdAt: data.created_at,
    };
  } catch {
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[]> {
  try {
    const { userId, limit = 20 } = params;
    const supabase = await createClient();
    const { data } = await supabase
      .from("interviews")
      .select("*")
      .eq("finalized", true)
      .neq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!data) return [];
    return data.map((i) => ({
      id: i.id,
      role: i.role,
      type: i.type,
      level: i.level,
      techstack: i.techstack,
      questions: i.questions,
      userId: i.user_id,
      finalized: i.finalized,
      coverImage: i.cover_image,
      createdAt: i.created_at,
    }));
  } catch {
    return [];
  }
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("interviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!data) return [];
    return data.map((i) => ({
      id: i.id,
      role: i.role,
      type: i.type,
      level: i.level,
      techstack: i.techstack,
      questions: i.questions,
      userId: i.user_id,
      finalized: i.finalized,
      coverImage: i.cover_image,
      createdAt: i.created_at,
    }));
  } catch {
    return [];
  }
}
