export type Page = 'home' | 'input-output' | 'networks' | 'algorithms' | 'it-skills';

export interface HardwareData {
  [key: string]: 'input' | 'output' | 'both';
}

export interface UserAnswers {
  [key: string]: 'input' | 'output' | 'both';
}