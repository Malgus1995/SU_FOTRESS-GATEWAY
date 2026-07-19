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
    rooms = new Map();
    createRoom(roomName, hostId, maxPlayers) {
        const host = this.players.get(hostId);
        const room = {
            id: crypto.randomUUID(),
            roomName,
            hostId,
            maxPlayers,
            status: 'waiting',
            players: [
                hostId,
            ],
            readyPlayers: [],
            snapshot: {
                version: 0,
                currentTurn: hostId,
                winner: null,
                turnAction: {
                    moved: false,
                    attacked: false,
                },
                players: host
                    ? [
                        this.toSnapshotPlayer(host),
                    ]
                    : [],
            },
        };
        if (host) {
            host.roomId =
                room.id;
        }
        this.rooms.set(room.id, room);
        return room;
    }
    getRooms() {
        return Array.from(this.rooms.values());
    }
    getRoom(id) {
        return this.rooms.get(id);
    }
    deleteRoom(id) {
        return this.rooms.delete(id);
    }
    addPlayer(id) {
        const existingPlayers = Array.from(this.players.values());
        let x = 0;
        let attempts = 0;
        do {
            x =
                Math.floor(Math.random() *
                    700) + 50;
            attempts += 1;
        } while (existingPlayers.some(player => Math.abs(player.x - x) < 100) &&
            attempts < 100);
        const player = {
            id,
            roomId: null,
            nickname: id,
            characterId: 'tank01',
            hp: 100,
            x,
            y: 540,
        };
        this.players.set(id, player);
        return player;
    }
    removePlayer(id) {
        const player = this.players.get(id);
        if (player?.roomId) {
            const room = this.rooms.get(player.roomId);
            if (room) {
                room.players =
                    room.players.filter(playerId => playerId !== id);
                room.readyPlayers =
                    room.readyPlayers.filter(playerId => playerId !== id);
                room.snapshot.players =
                    room.snapshot.players.filter(snapshotPlayer => snapshotPlayer.id !==
                        id);
                if (room.players.length ===
                    0) {
                    this.rooms.delete(room.id);
                }
            }
        }
        this.players.delete(id);
    }
    getPlayer(id) {
        return this.players.get(id);
    }
    getPlayers() {
        return Array.from(this.players.values());
    }
    readyPlayer(playerId) {
        const player = this.players.get(playerId);
        if (!player?.roomId) {
            return null;
        }
        const room = this.rooms.get(player.roomId);
        if (!room) {
            return null;
        }
        if (!room.readyPlayers.includes(playerId)) {
            room.readyPlayers.push(playerId);
        }
        return room;
    }
    isReadyToStart(roomId) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return false;
        }
        return (room.players.length >= 2 &&
            room.readyPlayers.length ===
                room.players.length);
    }
    joinRoom(playerId, roomId) {
        const player = this.players.get(playerId);
        const room = this.rooms.get(roomId);
        if (!player ||
            !room) {
            return null;
        }
        if (room.status !==
            'waiting') {
            return null;
        }
        if (room.players.length >=
            room.maxPlayers) {
            return null;
        }
        player.roomId =
            roomId;
        if (!room.players.includes(playerId)) {
            room.players.push(playerId);
        }
        const exists = room.snapshot.players.some(snapshotPlayer => snapshotPlayer.id ===
            playerId);
        if (!exists) {
            room.snapshot.players.push(this.toSnapshotPlayer(player));
        }
        return player;
    }
    toSnapshotPlayer(player) {
        return {
            id: player.id,
            x: player.x,
            y: player.y,
            hp: player.hp,
            maxHp: 100,
            fuel: 100,
            maxFuel: 100,
            alive: true,
            facing: 1,
        };
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
//# sourceMappingURL=game.service.js.map