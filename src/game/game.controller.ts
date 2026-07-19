import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';

import {
  GameService,
} from './game.service';

import {
  CreatePlayerDto,
} from './dto/player.dto';

import {
  CreateRoomDto,
  JoinRoomDto,
} from './dto/room.dto';

class ReadyPlayerDto {
  playerId: string;
}

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService:
      GameService,
  ) {}

  @Get('health')
  healthCheck() {
    return {
      status:
        'ok',

      service:
        'fortress-gateway',
    };
  }

  @Get('players')
  getPlayers() {
    return this.gameService
      .getPlayers();
  }

  @Get('players/:id')
  getPlayer(
    @Param('id')
    id: string,
  ) {
    const player =
      this.gameService.getPlayer(
        id,
      );

    if (!player) {
      throw new NotFoundException(
        `Player not found: ${id}`,
      );
    }

    return player;
  }

  @Post('players')
  createPlayer(
    @Body()
    body: CreatePlayerDto,
  ) {
    const player =
      this.gameService.addPlayer(
        body.id,
      );

    return {
      message:
        'player created',

      player,
    };
  }

  @Get('rooms')
  getRooms() {
    return this.gameService
      .getRooms();
  }

  @Get('rooms/:id')
  getRoom(
    @Param('id')
    id: string,
  ) {
    const room =
      this.gameService.getRoom(
        id,
      );

    if (!room) {
      throw new NotFoundException(
        `Room not found: ${id}`,
      );
    }

    return room;
  }

  @Post('rooms')
  createRoom(
    @Body()
    body: CreateRoomDto,
  ) {
    return this.gameService
      .createRoom(
        body.roomName,
        body.hostId,
        body.maxPlayers,
      );
  }

  @Post('rooms/:roomId/join')
  joinRoom(
    @Param('roomId')
    roomId: string,

    @Body()
    body: JoinRoomDto,
  ) {
    const player =
      this.gameService.joinRoom(
        body.id,
        roomId,
      );

    if (!player) {
      throw new NotFoundException(
        'Room join failed',
      );
    }

    return {
      message:
        'room joined',

      roomId,

      player,
    };
  }

  @Post('rooms/:roomId/ready')
  readyPlayer(
    @Param('roomId')
    roomId: string,

    @Body()
    body: ReadyPlayerDto,
  ) {
    const player =
      this.gameService.getPlayer(
        body.playerId,
      );

    if (
      !player ||
      player.roomId !== roomId
    ) {
      throw new NotFoundException(
        'Player is not in this room',
      );
    }

    const room =
      this.gameService.readyPlayer(
        body.playerId,
      );

    if (!room) {
      throw new NotFoundException(
        'Ready request failed',
      );
    }

    return {
      message:
        'player ready',

      roomId:
        room.id,

      playerId:
        body.playerId,

      readyPlayers:
        room.readyPlayers,

      readyCount:
        room.readyPlayers.length,

      playerCount:
        room.players.length,

      canStart:
        this.gameService
          .isReadyToStart(
            room.id,
          ),
    };
  }

  @Get('rooms/:roomId/ready-status')
  getReadyStatus(
    @Param('roomId')
    roomId: string,
  ) {
    const room =
      this.gameService.getRoom(
        roomId,
      );

    if (!room) {
      throw new NotFoundException(
        `Room not found: ${roomId}`,
      );
    }

    return {
      roomId:
        room.id,

      status:
        room.status,

      players:
        room.players,

      readyPlayers:
        room.readyPlayers,

      readyCount:
        room.readyPlayers.length,

      playerCount:
        room.players.length,

      canStart:
        this.gameService
          .isReadyToStart(
            room.id,
          ),
    };
  }
}