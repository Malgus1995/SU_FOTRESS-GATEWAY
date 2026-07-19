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
exports.GameController = void 0;
const common_1 = require("@nestjs/common");
const game_service_1 = require("./game.service");
const player_dto_1 = require("./dto/player.dto");
const room_dto_1 = require("./dto/room.dto");
class ReadyPlayerDto {
    playerId;
}
let GameController = class GameController {
    gameService;
    constructor(gameService) {
        this.gameService = gameService;
    }
    healthCheck() {
        return {
            status: 'ok',
            service: 'fortress-gateway',
        };
    }
    getPlayers() {
        return this.gameService
            .getPlayers();
    }
    getPlayer(id) {
        const player = this.gameService.getPlayer(id);
        if (!player) {
            throw new common_1.NotFoundException(`Player not found: ${id}`);
        }
        return player;
    }
    createPlayer(body) {
        const player = this.gameService.addPlayer(body.id);
        return {
            message: 'player created',
            player,
        };
    }
    getRooms() {
        return this.gameService
            .getRooms();
    }
    getRoom(id) {
        const room = this.gameService.getRoom(id);
        if (!room) {
            throw new common_1.NotFoundException(`Room not found: ${id}`);
        }
        return room;
    }
    createRoom(body) {
        return this.gameService
            .createRoom(body.roomName, body.hostId, body.maxPlayers);
    }
    joinRoom(roomId, body) {
        const player = this.gameService.joinRoom(body.id, roomId);
        if (!player) {
            throw new common_1.NotFoundException('Room join failed');
        }
        return {
            message: 'room joined',
            roomId,
            player,
        };
    }
    readyPlayer(roomId, body) {
        const player = this.gameService.getPlayer(body.playerId);
        if (!player ||
            player.roomId !== roomId) {
            throw new common_1.NotFoundException('Player is not in this room');
        }
        const room = this.gameService.readyPlayer(body.playerId);
        if (!room) {
            throw new common_1.NotFoundException('Ready request failed');
        }
        return {
            message: 'player ready',
            roomId: room.id,
            playerId: body.playerId,
            readyPlayers: room.readyPlayers,
            readyCount: room.readyPlayers.length,
            playerCount: room.players.length,
            canStart: this.gameService
                .isReadyToStart(room.id),
        };
    }
    getReadyStatus(roomId) {
        const room = this.gameService.getRoom(roomId);
        if (!room) {
            throw new common_1.NotFoundException(`Room not found: ${roomId}`);
        }
        return {
            roomId: room.id,
            status: room.status,
            players: room.players,
            readyPlayers: room.readyPlayers,
            readyCount: room.readyPlayers.length,
            playerCount: room.players.length,
            canStart: this.gameService
                .isReadyToStart(room.id),
        };
    }
};
exports.GameController = GameController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)('players'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameController.prototype, "getPlayers", null);
__decorate([
    (0, common_1.Get)('players/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "getPlayer", null);
__decorate([
    (0, common_1.Post)('players'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [player_dto_1.CreatePlayerDto]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "createPlayer", null);
__decorate([
    (0, common_1.Get)('rooms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameController.prototype, "getRooms", null);
__decorate([
    (0, common_1.Get)('rooms/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "getRoom", null);
__decorate([
    (0, common_1.Post)('rooms'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [room_dto_1.CreateRoomDto]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "createRoom", null);
__decorate([
    (0, common_1.Post)('rooms/:roomId/join'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, room_dto_1.JoinRoomDto]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Post)('rooms/:roomId/ready'),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ReadyPlayerDto]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "readyPlayer", null);
__decorate([
    (0, common_1.Get)('rooms/:roomId/ready-status'),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "getReadyStatus", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map