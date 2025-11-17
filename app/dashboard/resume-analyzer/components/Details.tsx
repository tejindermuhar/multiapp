// components/resume/Details.tsx
'use client'

import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionHeader, AccordionItem } from "./Accordion";
import ScoreBadge from "@/app/dashboard/resume-analyzer/components/ScoreBadge";

const CategoryHeader = ({ title, categoryScore }: { title: string; categoryScore: number }) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2">
      <p className="text-2xl font-semibold">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({ tips }: { tips: any[] }) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-2 items-center" key={index}>
            <span className="text-lg">{tip.type === "good" ? "✓" : "⚠"}</span>
            <p className="text-lg text-gray-600">{tip.tip}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4",
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              <span className="text-lg">{tip.type === "good" ? "✓" : "⚠"}</span>
              <p className="text-lg font-semibold">{tip.tip}</p>
            </div>
            <p>{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Details({ feedback }: { feedback: any }) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Accordion>
        {feedback.toneAndStyle && (
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader title="Tone & Style" categoryScore={feedback.toneAndStyle.score} />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
        )}
        {feedback.content && (
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader title="Content" categoryScore={feedback.content.score} />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
        )}
        {feedback.structure && (
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader title="Structure" categoryScore={feedback.structure.score} />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
        )}
        {feedback.skills && (
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader title="Skills" categoryScore={feedback.skills.score} />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
