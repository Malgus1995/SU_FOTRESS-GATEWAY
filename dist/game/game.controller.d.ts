import { GameService } from './game.service';
import { CreatePlayerDto } from './dto/player.dto';
import { MovePlayerDto } from './dto/player.dto';
import { CreateRoomDto, JoinRoomDto } from './dto/room.dto';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    healthCheck(): {
        status: string;
        service: string;
    };
    getPlayers(): import("./entities/player.entity").Player[];
    getPlayer(id: string): import("./entities/player.entity").Player | undefined;
    createPlayer(body: CreatePlayerDto): {
        message: string;
        id: string;
    };
    joinRoom(body: JoinRoomDto): {
        message: string;
        player: import("./entities/player.entity").Player | null;
    };
    getRoom(id: string): import("./entities/rooms.entity").Room | undefined;
    getRooms(): import("./entities/rooms.entity").Room[];
    createRoom(body: CreateRoomDto): import("./entities/rooms.entity").Room;
    movePlayer(body: MovePlayerDto): {
        message: string;
        player: import("./entities/player.entity").Player | null;
    };
}
