import { GameSnapshot } from
'../../physics/types/game-snapshot';

export class Room {
  id: string;
  roomName: string;
  hostId: string;
  maxPlayers: number;
  status:
    | 'waiting'
    | 'playing'
    | 'finished';

  players: string[];
  readyPlayers: string[];
  currentTurn: string;
  turnIndex: number;
  snapshot: GameSnapshot;
}