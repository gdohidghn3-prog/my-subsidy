export interface Eligibility {
  businessTypes: string[];
  industries: string[];
  regions: string[];
  businessAge: { min?: number; max?: number };
  employeeCount?: { min?: number; max?: number };
  revenue?: { max?: number };
  specialConditions: string[];
}

export interface Subsidy {
  id: string;
  title: string;
  organization: string;
  source: string;
  sourceUrl: string;
  eligibility: Eligibility;
  supportAmount: string;
  supportType: "보조금" | "융자" | "멘토링" | "교육" | "복합";
  supportDetails: string;
  startDate: string;
  endDate: string;
  announcementDate?: string;
  contactPhone?: string;
}

export interface UserProfile {
  businessType: string;
  industry: string;
  region: string;
  businessAge: number;
  employeeCount: number;
  annualRevenue?: number;
  specialTags: string[];
}

export interface MatchResult {
  subsidy: Subsidy;
  score: number;
  reasons: string[];
}
