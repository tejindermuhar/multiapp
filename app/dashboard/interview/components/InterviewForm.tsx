"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InterviewFormProps {
  userId: string;
  userName: string;
}

export default function InterviewForm({ userId, userName }: InterviewFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    type: "technical",
    level: "junior",
    techstack: "",
    amount: "5",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userid: userId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Interview created successfully!");
        router.push("/dashboard/interview");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to create interview");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Role */}
      <div className="space-y-2">
        <Label htmlFor="role">Job Role *</Label>
        <Input
          id="role"
          placeholder="e.g. Full Stack Developer, Product Manager"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        />
      </div>

      {/* Interview Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Interview Type *</Label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="technical">Technical</option>
          <option value="behavioral">Behavioral</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <Label htmlFor="level">Experience Level *</Label>
        <select
          id="level"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="junior">Junior (0-2 years)</option>
          <option value="mid">Mid-Level (2-5 years)</option>
          <option value="senior">Senior (5+ years)</option>
        </select>
      </div>

      {/* Tech Stack */}
      <div className="space-y-2">
        <Label htmlFor="techstack">Tech Stack *</Label>
        <Input
          id="techstack"
          placeholder="e.g. React, Node.js, PostgreSQL (comma-separated)"
          value={formData.techstack}
          onChange={(e) => setFormData({ ...formData, techstack: e.target.value })}
          required
        />
        <p className="text-sm text-gray-500">
          Enter technologies separated by commas
        </p>
      </div>

      {/* Number of Questions */}
      <div className="space-y-2">
        <Label htmlFor="amount">Number of Questions *</Label>
        <select
          id="amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="3">3 Questions</option>
          <option value="5">5 Questions</option>
          <option value="7">7 Questions</option>
          <option value="10">10 Questions</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating...
            </>
          ) : (
            "Create Interview"
          )}
        </Button>
      </div>
    </form>
  );
}
