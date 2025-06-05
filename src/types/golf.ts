
export interface GolfClub {
  id: string;
  name: string;
  type: 'driver' | 'wood' | 'hybrid' | 'iron' | 'wedge';
  loft: number;
  distance: number;
}

export interface SwingMetrics {
  swingSpeed: number; // mph
  ballSpeed: number; // mph
  launchAngle: number; // degrees
  spinRate: number; // rpm
  smashFactor: number;
  carryDistance: number; // yards
  ballFlight: 'straight' | 'draw' | 'fade' | 'slice' | 'hook' | 'pull' | 'push';
}

export interface GolfHole {
  number: number;
  par: number;
  distance: number;
  name: string;
  description: string;
  hazards: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CoachingTip {
  category: 'setup' | 'backswing' | 'downswing' | 'impact' | 'follow-through';
  issue: string;
  tip: string;
  drill: string;
}
