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
let GameGateway = class GameGateway {
    gameService;
    constructor(gameService) {
        this.gameService = gameService;
    }
    server;
    handleConnection(client) {
        this.gameService.addPlayer(client.id);
        console.log(`[CONNECTED] ${client.id}`);
    }
    handleDisconnect(client) {
        this.gameService.removePlayer(client.id);
        this.server.emit('playerLeft', {
            id: client.id,
        });
        console.log(`[DISCONNECTED] ${client.id}`);
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
        if (canStart) {
            room.status =
                'playing';
            this.server
                .to(room.id)
                .emit('gameStart');
        }
    }
    handleSync(client) {
        console.log(`[SYNC REQUEST] ${client.id}`);
        client.emit('sync', {
            players: this.gameService.getPlayers(),
        });
    }
    handleJoinRoom(data, client) {
        console.log('[JOIN ROOM EVENT]', client.id, data.roomId);
        const player = this.gameService.joinRoom(client.id, data.roomId);
        if (!player)
            return;
        client.join(data.roomId);
        console.log(`[ROOM JOIN]
       player=${client.id}
       room=${data.roomId}`);
        this.server.to(data.roomId).emit('playerJoined', {
            id: client.id,
            x: player.x,
            y: player.y,
        });
    }
    handleMove(data, client) {
        const player = this.gameService.movePlayer(client.id, data.x, data.y);
        if (!player)
            return;
        if (!player.roomId)
            return;
        console.log(`[MOVE]
       player=${client.id}
       x=${player.x}
       y=${player.y}`);
        this.server.to(player.roomId).emit('playerMoved', {
            id: client.id,
            x: player.x,
            y: player.y,
        });
    }
    handleAttack(data, client) {
        const player = this.gameService.getPlayer(client.id);
        if (!player)
            return;
        if (!player.roomId)
            return;
        console.log(`[ATTACK]
       player=${client.id}
       room=${player.roomId}
       angle=${data.angle}
       power=${data.power}`);
        this.server.to(player.roomId).emit('playerAttack', {
            id: client.id,
            angle: data.angle,
            power: data.power,
        });
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
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
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('move'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('attack'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleAttack", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map