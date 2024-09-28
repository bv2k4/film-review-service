export interface AnalysisResult {
    sentiment: string;
    confidence: number;
    rating: number;
  }
  
  export interface ApiError {
    detail: string;
  }