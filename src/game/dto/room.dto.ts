import { ApiProperty } from '@nestjs/swagger';

export class JoinRoomDto {
  @ApiProperty({
    example: 'player1',
    description: 'Player ID',
  })
  id: string;

  @ApiProperty({
    example: 'room1',
    description: 'Room ID',
  })
  roomId: string;
}

export class CreateRoomDto {
  @ApiProperty({
    example: '성욱의 방',
    description: 'Room Name',
  })
  roomName: string;

  @ApiProperty({
    example: 2,
    description: 'Maximum Players',
  })
  maxPlayers: number;

  @ApiProperty({
    example: 'player1',
    description: 'Host Player ID',
  })
  hostId: string;
}