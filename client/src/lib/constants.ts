export const ZONE_TYPES = ['RESTROOM', 'CANTEEN', 'CORRIDOR', 'CLASSROOM', 'GROUND', 'LAB'] as const;

export const REPORT_CATEGORIES = [
  { value: 'WASTE', label: 'Waste / Garbage' },
  { value: 'SPILL', label: 'Water / Liquid Spill' },
  { value: 'ODOR', label: 'Bad Odor' },
  { value: 'GRAFFITI', label: 'Graffiti / Vandalism' },
  { value: 'BROKEN_FIXTURE', label: 'Broken Fixture' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const REPORT_SEVERITIES = [
  { value: 'LOW', label: 'Low', color: 'blue' },
  { value: 'MEDIUM', label: 'Medium', color: 'yellow' },
  { value: 'HIGH', label: 'High', color: 'orange' },
  { value: 'CRITICAL', label: 'Critical', color: 'red' },
] as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'Hindi (हिन्दी)' },
  { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)' },
] as const;

export const SCORE_THRESHOLDS = {
  CLEAN: 70,
  ATTENTION: 40,
} as const;
