
export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'trial';
}

export interface PlayerPosition {
  id: string;
  team: 'A' | 'B';
  label: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface JRCGame {
  id: string;
  title: string;
  theme: string;
  category: string;
  duration: string;
  description: string;
  setup: {
    players: string;
    dimensions: string;
    materials: string[];
  };
  rules: string[];
  systemicFocus: string;
  complexityPrinciples: string[];
  emergentBehaviors: string[];
  visualData: {
    players: PlayerPosition[];
  };
}

export interface GenerationRequest {
  theme: string;
  category: string;
  duration: string;
  intensity: 'low' | 'medium' | 'high';
}

