import {
  Controller,
  Get,
  Param,
  Post,
  Body,
} from '@nestjs/common';

import { GameService } from './game.service';


import { CreatePlayerDto } from './dto/player.dto';
import { MovePlayerDto } from './dto/player.dto';
import { CreateRoomDto, JoinRoomDto } from './dto/room.dto';



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

@Get('rooms/:id')
getRoom(
  @Param('id') id: string,
) {
  return this.gameService.getRoom(id);
}

@Get('rooms')
getRooms() {
  return this.gameService.getRooms();
}

@Post('rooms')
createRoom(
  @Body()
  body: CreateRoomDto,
) {
  console.log(body);

  return this.gameService.createRoom(
    body.roomName,
    body.hostId,
    body.maxPlayers,
  );
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