import { GameService } from './game.service';
import { CreatePlayerDto } from './dto/player.dto';
import { CreateRoomDto, JoinRoomDto } from './dto/room.dto';
declare class ReadyPlayerDto {
    playerId: string;
}
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    healthCheck(): {
        status: string;
        service: string;
    };
    getPlayers(): import("./entities/player.entity").Player[];
    getPlayer(id: string): import("./entities/player.entity").Player;
    createPlayer(body: CreatePlayerDto): {
        message: string;
        player: import("./entities/player.entity").Player;
    };
    getRooms(): import("./entities/rooms.entity").Room[];
    getRoom(id: string): import("./entities/rooms.entity").Room;
    createRoom(body: CreateRoomDto): import("./entities/rooms.entity").Room;
    joinRoom(roomId: string, body: JoinRoomDto): {
        message: string;
        roomId: string;
        player: import("./entities/player.entity").Player;
    };
    readyPlayer(roomId: string, body: ReadyPlayerDto): {
        message: string;
        roomId: string;
        playerId: string;
        readyPlayers: string[];
        readyCount: number;
        playerCount: number;
        canStart: boolean;
    };
    getReadyStatus(roomId: string): {
        roomId: string;
        status: import("./entities/rooms.entity").RoomStatus;
        players: string[];
        readyPlayers: string[];
        readyCount: number;
        playerCount: number;
        canStart: boolean;
    };
}
export {};
