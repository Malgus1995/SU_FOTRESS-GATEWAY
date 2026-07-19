import { Player } from './entities/player.entity';
import type { Room } from './entities/rooms.entity';
export declare class GameService {
    private readonly players;
    private readonly rooms;
    createRoom(roomName: string, hostId: string, maxPlayers: number): Room;
    getRooms(): Room[];
    getRoom(id: string): Room | undefined;
    deleteRoom(id: string): boolean;
    addPlayer(id: string): Player;
    removePlayer(id: string): void;
    getPlayer(id: string): Player | undefined;
    getPlayers(): Player[];
    readyPlayer(playerId: string): Room | null;
    isReadyToStart(roomId: string): boolean;
    joinRoom(playerId: string, roomId: string): Player | null;
    private toSnapshotPlayer;
}
