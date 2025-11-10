// components/resume/Summary.tsx
import ScoreGauge from "./ScoreGauge";
import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70 ? "text-green-600" : score > 49 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
      <div className="flex flex-row gap-2 items-center">
        <p className="text-lg font-medium">{title}</p>
        <ScoreBadge score={score} />
      </div>
      <p className="text-lg font-semibold">
        <span className={textColor}>{score}</span>/100
      </p>
    </div>
  );
};

export default function Summary({ feedback }: { feedback: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-6 gap-8">
        <ScoreGauge score={feedback.score || feedback.overallScore || 0} />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      {feedback.toneAndStyle && <Category title="Tone & Style" score={feedback.toneAndStyle.score} />}
      {feedback.content && <Category title="Content" score={feedback.content.score} />}
      {feedback.structure && <Category title="Structure" score={feedback.structure.score} />}
      {feedback.skills && <Category title="Skills" score={feedback.skills.score} />}
    </div>
  );
}
