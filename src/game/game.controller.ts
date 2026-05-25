import {
  Controller,
  Get,
  Param,
  Post,
  Body,
} from '@nestjs/common';

import { GameService } from './game.service';


import { CreatePlayerDto } from './dto/game.dto';

import { JoinRoomDto } from './dto/game.dto';

import { MovePlayerDto } from './dto/game.dto';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
  ) {}

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'fortress-gateway',
    };
  }

  @Get('players')
  getPlayers() {
    return this.gameService.getPlayers();
  }

  @Get('players/:id')
  getPlayer(
    @Param('id') id: string,
  ) {
    return this.gameService.getPlayer(id);
  }

  @Post('players')
  createPlayer(
    @Body() body: CreatePlayerDto,
  ) {
    this.gameService.addPlayer(body.id);

    return {
      message: 'player created',
      id: body.id,
    };
  }

  @Post('join-room')
  joinRoom(
    @Body() body: JoinRoomDto,
  ) {
    const player = this.gameService.joinRoom(
      body.id,
      body.roomId,
    );

    return {
      message: 'room joined',
      player,
    };
  }

  @Post('move')
  movePlayer(
    @Body() body: MovePlayerDto,
  ) {
    const player = this.gameService.movePlayer(
      body.id,
      body.x,
      body.y,
    );

    return {
      message: 'player moved',
      player,
    };
  }
}