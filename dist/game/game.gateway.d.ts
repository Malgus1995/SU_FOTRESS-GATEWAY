import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { CommandExecutorService } from './command/command-executor.service';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameService;
    private readonly commandExecutor;
    constructor(gameService: GameService, commandExecutor: CommandExecutorService);
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(data: {
        roomId: string;
    }, client: Socket): void;
    handleReady(client: Socket): void;
    handleSync(client: Socket): void;
    handleMove(data: {
        direction: -1 | 1;
    }, client: Socket): Promise<void>;
    handleAttack(data: {
        angle: number;
        power: number;
    }, client: Socket): Promise<void>;
    handleTurnEnd(client: Socket): Promise<void>;
    private executeClientCommand;
    private getClientRoom;
    private broadcastSnapshot;
}
