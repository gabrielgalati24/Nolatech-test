export type Role = 'Admin' | 'Manager' | 'Employee';


export interface Employee {
    _id: string;
    name: string;
    email: string;
    role: string;
    evaluationsData?: {
      totalEvaluations: number;
      averageScore: number;
      maxScore: number;
      minScore: number;
    } | null;
  }
  
  export interface EvaluationData {
    totalEvaluations: number;
    averageScore: number;
    maxScore: number;
    minScore: number;
  }

  export interface EvaluationData {
    note: string | null;
    score: number | null;
  }
  
  export interface Evaluation {
    _id: string;
    note: string;
    score: number;
    employee: Employee;
  }
  