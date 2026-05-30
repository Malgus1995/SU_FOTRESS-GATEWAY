"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
let GameService = class GameService {
    players = new Map();
    addPlayer(id) {
        const existingPlayers = Array.from(this.players.values());
        let x = 0;
        while (true) {
            x =
                Math.floor(Math.random() * 700) + 50;
            const tooClose = existingPlayers.some((player) => Math.abs(player.x - x) < 100);
            if (!tooClose) {
                break;
            }
        }
        this.players.set(id, {
            id,
            roomId: null,
            nickname: id,
            characterId: 'tank01',
            hp: 100,
            x,
            y: 540,
        });
    }
    removePlayer(id) {
        this.players.delete(id);
    }
    getPlayer(id) {
        return this.players.get(id);
    }
    getPlayers() {
        return Array.from(this.players.values());
    }
    joinRoom(id, roomId) {
        const player = this.players.get(id);
        if (!player)
            return null;
        player.roomId = roomId;
        return player;
    }
    movePlayer(id, x, y) {
        const player = this.players.get(id);
        if (!player)
            return null;
        player.x = x;
        player.y = y;
        return player;
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
//# sourceMappingURL=game.service.js.map