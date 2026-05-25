export interface Player {
    id: string;
    roomId: string | null;
    x: number;
    y: number;
}
export declare class GameService {
    private players;
    addPlayer(id: string): void;
    removePlayer(id: string): void;
    getPlayer(id: string): Player | undefined;
    getPlayers(): Player[];
    joinRoom(id: string, roomId: string): Player | null;
    movePlayer(id: string, x: number, y: number): Player | null;
}
