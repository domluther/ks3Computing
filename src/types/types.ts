export interface HardwareTypes {
  [key: string]: 'input' | 'output' | 'both';
}

export type PageDescription = { 
  id: 'home' | 'input-output' | 'online-safety' | 'algorithms' | 'it-skills'; 
  emoji: string; 
  title: string; 
  description: string; 
  enabled: boolean 
}