import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INDUSTRIES = [
  "Academia & Research",
  "Health / Biotech",
  "Tech",
  "Corporate",
  "Entrepreneurship",
  "Government / Public Service",
  "Agriculture & Environment",
  "Education / Teaching",
  "Other",
] as const;

export function gradYears() {
  const now = new Date().getFullYear();
  const years: number[] = [];
  for (let y = now; y >= 1981; y--) years.push(y);
  return years;
}
