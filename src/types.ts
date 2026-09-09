export interface Project {
  id: string;
  title: string;
  category: 'firmware' | 'hardware' | 'iot';
  categoryLabel: string;
  organization: string;
  timeline: string;
  summary: string;
  image: string;
  highlights: string[];
  specs: {
    mcu?: string;
    protocols?: string[];
    hardware?: string[];
    software?: string[];
    samplingRate?: string;
    pcbDimensions?: string;
  };
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
  keyTakeaway: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  subtitle: string;
  period: string;
  type: 'internship' | 'leadership' | 'education';
  location: string;
  points: string[];
  technologies: string[];
}

export interface SkillCategory {
  title: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: string; // e.g., 'Advanced', 'Proficient', 'Core'
    highlight?: boolean;
    detail?: string;
  }[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  badge: string;
  description: string;
}
