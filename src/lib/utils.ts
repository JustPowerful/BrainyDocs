import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function summarize(text: string, maxLength = 100) {
  // Split the text into sentences
  const sentences = text
    .split(/\.|\?|\!/g)
    .filter((sentence) => sentence.trim());

  // Sort sentences by their length (descending)
  sentences.sort((a, b) => b.length - a.length);

  // Take the first N sentences to reach the desired length
  let summary = "";
  let totalLength = 0;
  for (const sentence of sentences) {
    const newLength = totalLength + sentence.length + 1; // Add 1 for space
    if (newLength <= maxLength) {
      summary += sentence + " ";
      totalLength = newLength;
    } else {
      break;
    }
  }

  // Remove trailing space
  summary = summary.trim();

  return summary;
}
