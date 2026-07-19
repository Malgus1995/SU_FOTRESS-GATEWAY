"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const game_service_1 = require("./game.service");
const command_executor_service_1 = require("./command/command-executor.service");
let GameGateway = class GameGateway {
    gameService;
    commandExecutor;
    constructor(gameService, commandExecutor) {
        this.gameService = gameService;
        this.commandExecutor = commandExecutor;
    }
    server;
    handleConnection(client) {
        this.gameService.addPlayer(client.id);
        console.log(`[CONNECTED] ${client.id}`);
    }
    handleDisconnect(client) {
        const player = this.gameService.getPlayer(client.id);
        const roomId = player?.roomId;
        this.gameService.removePlayer(client.id);
        if (roomId) {
            this.server
                .to(roomId)
                .emit('playerLeft', {
                id: client.id,
            });
        }
        console.log(`[DISCONNECTED] ${client.id}`);
    }
    handleJoinRoom(data, client) {
        const player = this.gameService.joinRoom(client.id, data.roomId);
        if (!player) {
            client.emit('commandRejected', {
                reason: 'ROOM_JOIN_FAILED',
            });
            return;
        }
        void client.join(data.roomId);
        const room = this.gameService.getRoom(data.roomId);
        this.server
            .to(data.roomId)
            .emit('playerJoined', {
            id: player.id,
            x: player.x,
            y: player.y,
        });
        if (room) {
            this.broadcastSnapshot(room);
        }
    }
    handleReady(client) {
        const room = this.gameService.readyPlayer(client.id);
        if (!room) {
            return;
        }
        this.server
            .to(room.id)
            .emit('playerReady', {
            playerId: client.id,
        });
        const canStart = this.gameService.isReadyToStart(room.id);
        if (!canStart) {
            return;
        }
        room.status =
            'playing';
        const randomIndex = Math.floor(Math.random() *
            room.players.length);
        room.snapshot.currentTurn =
            room.players[randomIndex];
        room.snapshot.turnAction = {
            moved: false,
            attacked: false,
        };
        room.snapshot.version +=
            1;
        this.server
            .to(room.id)
            .emit('gameStart', {
            currentTurn: room.snapshot.currentTurn,
        });
        this.broadcastSnapshot(room);
    }
    handleSync(client) {
        const context = this.getClientRoom(client.id);
        if (!context) {
            client.emit('sync', {
                snapshot: null,
            });
            return;
        }
        client.emit('sync', {
            snapshot: context.room.snapshot,
        });
    }
    async handleMove(data, client) {
        await this.executeClientCommand(client, {
            type: 'MOVE',
            playerId: client.id,
            x: data.x,
            y: data.y,
        });
    }
    async handleAttack(data, client) {
        await this.executeClientCommand(client, {
            type: 'ATTACK',
            playerId: client.id,
            angle: data.angle,
            power: data.power,
        });
    }
    async handleTurnEnd(client) {
        await this.executeClientCommand(client, {
            type: 'END_TURN',
            playerId: client.id,
        });
    }
    async executeClientCommand(client, command) {
        const context = this.getClientRoom(client.id);
        if (!context) {
            client.emit('commandRejected', {
                command: command.type,
                reason: 'ROOM_NOT_FOUND',
            });
            return;
        }
        const { room, } = context;
        try {
            const previousTurn = room.snapshot.currentTurn;
            const previousWinner = room.snapshot.winner;
            const nextSnapshot = await this.commandExecutor
                .execute(room, command);
            this.broadcastSnapshot(room);
            if (previousTurn !==
                nextSnapshot.currentTurn) {
                this.server
                    .to(room.id)
                    .emit('turnChanged', {
                    playerId: nextSnapshot.currentTurn,
                });
            }
            if (!previousWinner &&
                nextSnapshot.winner) {
                this.server
                    .to(room.id)
                    .emit('gameFinished', {
                    winner: nextSnapshot.winner,
                });
            }
        }
        catch (error) {
            console.error(`[COMMAND ERROR] room=${room.id} command=${command.type}`, error);
            client.emit('commandRejected', {
                command: command.type,
                reason: 'PHYSICS_UNAVAILABLE',
            });
        }
    }
    getClientRoom(clientId) {
        const player = this.gameService.getPlayer(clientId);
        if (!player?.roomId) {
            return null;
        }
        const room = this.gameService.getRoom(player.roomId);
        if (!room) {
            return null;
        }
        return {
            room,
        };
    }
    broadcastSnapshot(room) {
        this.server
            .to(room.id)
            .emit('snapshot', room.snapshot);
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ready'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleReady", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sync'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleSync", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('move'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('attack'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleAttack", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('turnEnd'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], GameGateway.prototype, "handleTurnEnd", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [game_service_1.GameService,
        command_executor_service_1.CommandExecutorService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map