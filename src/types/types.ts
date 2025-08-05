export type Page = 'home' | 'input-output' | 'online-safety' | 'algorithms' | 'it-skills';

export interface HardwareData {
  [key: string]: 'input' | 'output' | 'both';
}

export interface UserAnswers {
  [key: string]: 'input' | 'output' | 'both';
}

export type PageDescription = { id: Page; emoji: string; title: string; description: string; enabled: boolean }