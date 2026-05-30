import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;
handleConnection(client: Socket) {
  this.gameService.addPlayer(client.id);

  console.log(`[CONNECTED] ${client.id}`);
}

handleDisconnect(client: Socket) {
  this.gameService.removePlayer(client.id);
  this.server.emit('playerLeft', {
    id: client.id,
  });
  console.log(`[DISCONNECTED] ${client.id}`);

}

@SubscribeMessage('sync')
handleSync(
  @ConnectedSocket() client: Socket,
) {
  console.log(
    `[SYNC REQUEST] ${client.id}`,
  );

  client.emit('sync', {
    players: this.gameService.getPlayers(),
  });
}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const player = this.gameService.joinRoom(
      client.id,
      data.roomId,
    );

    if (!player) return;

    client.join(data.roomId);

    console.log(
      `[ROOM JOIN]
       player=${client.id}
       room=${data.roomId}`,
    );

this.server.to(data.roomId).emit('playerJoined', {
  id: client.id,
  x: player.x,
  y: player.y,
});
  }

  @SubscribeMessage('move')
  handleMove(
    @MessageBody() data: { x: number; y: number },
    @ConnectedSocket() client: Socket,
  ) {
    const player = this.gameService.movePlayer(
      client.id,
      data.x,
      data.y,
    );

    if (!player) return;

    if (!player.roomId) return;

    console.log(
      `[MOVE]
       player=${client.id}
       x=${player.x}
       y=${player.y}`,
    );

    this.server.to(player.roomId).emit('playerMoved', {
      id: client.id,
      x: player.x,
      y: player.y,
    });
  }

  @SubscribeMessage('attack')
  handleAttack(
    @MessageBody()
    data: {
      angle: number;
      power: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const player = this.gameService.getPlayer(client.id);

    if (!player) return;

    if (!player.roomId) return;

    console.log(
      `[ATTACK]
       player=${client.id}
       room=${player.roomId}
       angle=${data.angle}
       power=${data.power}`,
    );

    // TODO:
    // Physics Service로 전달 예정

    this.server.to(player.roomId).emit('playerAttack', {
      id: client.id,
      angle: data.angle,
      power: data.power,
    });
  }
}