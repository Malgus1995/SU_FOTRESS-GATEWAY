export interface PlayerCommand {
  playerId: string;
  type:
    | 'MOVE'
    | 'ATTACK';

  distance?: number;
  angle?: number;
  power?: number;
}