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
const player_dto_2 = require("./dto/player.dto");
const room_dto_1 = require("./dto/room.dto");
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
        return this.gameService.getPlayers();
    }
    getPlayer(id) {
        return this.gameService.getPlayer(id);
    }
    createPlayer(body) {
        this.gameService.addPlayer(body.id);
        return {
            message: 'player created',
            id: body.id,
        };
    }
    joinRoom(body) {
        const player = this.gameService.joinRoom(body.id, body.roomId);
        return {
            message: 'room joined',
            player,
        };
    }
    movePlayer(body) {
        const player = this.gameService.movePlayer(body.id, body.x, body.y);
        return {
            message: 'player moved',
            player,
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
    (0, common_1.Post)('join-room'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [room_dto_1.JoinRoomDto]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Post)('move'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [player_dto_2.MovePlayerDto]),
    __metadata("design:returntype", void 0)
], GameController.prototype, "movePlayer", null);
exports.GameController = GameController = __decorate([
    (0, common_1.Controller)('game'),
    __metadata("design:paramtypes", [game_service_1.GameService])
], GameController);
//# sourceMappingURL=game.controller.js.map