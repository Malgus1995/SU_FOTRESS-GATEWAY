import { Player } from './entities/player.entity';
import { Room } from './entities/rooms.entity';
export declare class GameService {
    private players;
    private rooms;
    createRoom(roomName: string, hostId: string, maxPlayers: number): Room;
    getRooms(): Room[];
    getRoom(id: string): Room | undefined;
    deleteRoom(id: string): boolean;
    addPlayer(id: string): void;
    removePlayer(id: string): void;
    getPlayer(id: string): Player | undefined;
    getPlayers(): Player[];
    readyPlayer(playerId: string): Room | null;
    isReadyToStart(roomId: string): boolean;
    joinRoom(playerId: string, roomId: string): Player | null;
    movePlayer(id: string, x: number, y: number): Player | null;
}
