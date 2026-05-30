import { Player } from './entities/player.entity';
export declare class GameService {
    private players;
    addPlayer(id: string): void;
    removePlayer(id: string): void;
    getPlayer(id: string): Player | undefined;
    getPlayers(): Player[];
    joinRoom(id: string, roomId: string): Player | null;
    movePlayer(id: string, x: number, y: number): Player | null;
}
