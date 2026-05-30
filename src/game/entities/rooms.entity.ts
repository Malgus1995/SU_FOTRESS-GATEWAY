export class Room {
  id: string;

  roomName: string;

  hostId: string;

  maxPlayers: number;

  status:
    | 'waiting'
    | 'playing';

  players: string[];
}