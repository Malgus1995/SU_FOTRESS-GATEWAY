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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovePlayerDto = exports.JoinRoomDto = exports.CreatePlayerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreatePlayerDto {
    id;
}
exports.CreatePlayerDto = CreatePlayerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'player1',
        description: 'Player ID',
    }),
    __metadata("design:type", String)
], CreatePlayerDto.prototype, "id", void 0);
class JoinRoomDto {
    id;
    roomId;
}
exports.JoinRoomDto = JoinRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'player1',
        description: 'Player ID',
    }),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'room1',
        description: 'Room ID',
    }),
    __metadata("design:type", String)
], JoinRoomDto.prototype, "roomId", void 0);
class MovePlayerDto {
    id;
    x;
    y;
}
exports.MovePlayerDto = MovePlayerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'player1',
        description: 'Player ID',
    }),
    __metadata("design:type", String)
], MovePlayerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 100,
        description: 'Player X Position',
    }),
    __metadata("design:type", Number)
], MovePlayerDto.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 200,
        description: 'Player Y Position',
    }),
    __metadata("design:type", Number)
], MovePlayerDto.prototype, "y", void 0);
//# sourceMappingURL=game.dto.js.map