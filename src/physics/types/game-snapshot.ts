export interface SnapshotPlayer {
  id: string;
  hp: number;
  x: number;
  y: number;
  alive: boolean;
}

export interface GameSnapshot {
  roomId: string;
  currentTurn: string;
  winner: string | null;
  players: SnapshotPlayer[];
}