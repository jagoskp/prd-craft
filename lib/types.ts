export interface Profile {
  id: string;
  email: string;
  full_name: string;
  credits: number;
  avatar_url?: string;
  created_at?: string;
}

export interface TechStackConfig {
  frontend: string;
  backend: string;
  database: string;
  auth?: string;
  hosting?: string;
  stateManagement?: string;
  orm?: string;
}

export interface UISettings {
  designStyle: string;
  colorPalette: {
    id?: string;
    name: string;
    primary: string;
    accent: string;
    preview: string[];
    description?: string;
  };
  themeMode: "dark" | "light" | "system";
  typography: {
    id?: string;
    name: string;
    family: string;
    description: string;
  };
}

export interface WizardFormData {
  platform: string;
  customPlatform?: string;
  techStack: TechStackConfig;
  uiSettings: UISettings;
  title: string;
  description: string;
  targetAudience?: string;
  constraints?: string;
  keyFeatures?: string[];
}

export interface PRDRecord {
  id: string;
  user_id: string;
  title: string;
  platform: string;
  tech_stack: TechStackConfig;
  ui_settings: UISettings;
  content: string;
  created_at: string;
}

export interface GeneratePRDRequest {
  platform: string;
  customPlatform?: string;
  techStack: TechStackConfig;
  uiSettings: UISettings;
  title: string;
  description: string;
  targetAudience?: string;
  constraints?: string;
}

export interface GeneratePRDResponse {
  success: boolean;
  prd?: PRDRecord;
  error?: string;
  creditsRemaining?: number;
}
