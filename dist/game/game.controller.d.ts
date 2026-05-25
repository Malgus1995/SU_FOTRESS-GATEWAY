import { GameService } from './game.service';
import { CreatePlayerDto } from './dto/game.dto';
import { JoinRoomDto } from './dto/game.dto';
import { MovePlayerDto } from './dto/game.dto';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    healthCheck(): {
        status: string;
        service: string;
    };
    getPlayers(): import("./game.service").Player[];
    getPlayer(id: string): import("./game.service").Player | undefined;
    createPlayer(body: CreatePlayerDto): {
        message: string;
        id: string;
    };
    joinRoom(body: JoinRoomDto): {
        message: string;
        player: import("./game.service").Player | null;
    };
    movePlayer(body: MovePlayerDto): {
        message: string;
        player: import("./game.service").Player | null;
    };
}
