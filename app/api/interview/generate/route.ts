import { createClient } from "@/lib/supabase/server";
import { getRandomInterviewCover } from "@/lib/utils";

// Mock question generator
function generateMockQuestions(role: string, level: string, techstack: string, type: string, amount: number): string[] {
  const techArray = techstack.split(",").map(t => t.trim());
  
  const questions = [
    `Tell me about your experience with ${techArray[0] || "the relevant technology"}.`,
    `How would you approach a complex ${type} challenge in a ${role} position?`,
    `Describe a project where you used ${techArray[1] || techArray[0] || "your skills"} at a ${level} level.`,
    `What's your understanding of best practices for ${techArray[0] || "modern development"}?`,
    `How do you stay updated with ${techArray.join(", ")} technologies?`,
    `Walk me through how you would debug a production issue in ${techArray[0] || "the system"}.`,
    `Describe your experience working in a ${level} ${role} capacity.`,
    `How would you mentor junior developers in ${techArray[0] || "the tech stack"}?`,
    `What's the most challenging ${type} problem you've solved recently?`,
    `How do you balance code quality with delivery timelines?`,
  ];
  
  return questions.slice(0, amount);
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    // Generate mock questions
    const questions = generateMockQuestions(role, level, techstack, type, parseInt(amount));

    const supabase = await createClient();

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(",").map((tech: string) => tech.trim()),
      questions: questions,
      user_id: userid,
      finalized: true,
      cover_image: getRandomInterviewCover(),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("interviews").insert(interview);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error creating interview:", error);
    
    return Response.json(
      { 
        success: false, 
        message: error?.message || "Failed to create interview" 
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Interview API" }, { status: 200 });
}
