import type {
  GameSnapshot,
} from '../common/types/snapshots';

export type RoomStatus =
  | 'waiting'
  | 'playing'
  | 'finished';

export interface Room {
  id: string;

  roomName: string;

  hostId: string;

  maxPlayers: number;

  status: RoomStatus;

  players: string[];

  readyPlayers: string[];

  snapshot: GameSnapshot;
}