import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    // Determine the appropriate unit by calculating the log
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Format with 2 decimal places and round
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const generateUUID = () => crypto.randomUUID();

const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings] || tech.toLowerCase();
};

const checkIconExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  // Add null/undefined check
  if (!techArray || !Array.isArray(techArray) || techArray.length === 0) {
    return [];
  }

  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => {
      const exists = await checkIconExists(url);
      return {
        tech,
        url: exists ? url : "/tech.svg",
      };
    })
  );

  return results;
};

export const getRandomInterviewCover = () => {
  if (!interviewCovers || interviewCovers.length === 0) {
    return "/covers/adobe.png"; // fallback
  }
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return interviewCovers[randomIndex];
};

// Add this helper function
export const normalizeImagePath = (path: string | null): string => {
  if (!path) return "/covers/adobe.png"; // default fallback
  
  // If already has /covers/, return as is
  if (path.startsWith('/covers/')) return path;
  
  // If starts with /, add /covers
  if (path.startsWith('/')) return `/covers${path}`;
  
  // If external URL, return as is
  if (path.startsWith('http')) return path;
  
  // Otherwise, return fallback
  return "/covers/adobe.png";
};  


export const getInterviewGradient = (type: string, role?: string) => {
  const gradients = {
    Technical: "from-blue-500 via-cyan-500 to-teal-500",
    Behavioral: "from-purple-500 via-pink-500 to-rose-500",
    Mixed: "from-violet-500 via-purple-500 to-fuchsia-500",
    Frontend: "from-orange-500 via-amber-500 to-yellow-500",
    Backend: "from-green-500 via-emerald-500 to-teal-500",
    "Full Stack": "from-indigo-500 via-purple-500 to-pink-500",
    DevOps: "from-slate-500 via-gray-500 to-zinc-500",
    Mobile: "from-blue-500 via-indigo-500 to-purple-500",
    AI: "from-cyan-500 via-blue-500 to-indigo-500",
    default: "from-purple-500 via-pink-500 to-blue-500",
  };

  // Try matching by type first, then by role
  const normalizedType = type.toLowerCase();
  const normalizedRole = role?.toLowerCase() || "";

  for (const [key, gradient] of Object.entries(gradients)) {
    if (normalizedType.includes(key.toLowerCase()) || normalizedRole.includes(key.toLowerCase())) {
      return gradient;
    }
  }

  return gradients.default;
};
