import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({
    example: 'player1',
    description: 'Player ID',
  })
  id: string;
}

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

export class MovePlayerDto {
  @ApiProperty({
    example: 'player1',
    description: 'Player ID',
  })
  id: string;

  @ApiProperty({
    example: 100,
    description: 'Player X Position',
  })
  x: number;

  @ApiProperty({
    example: 200,
    description: 'Player Y Position',
  })
  y: number;
}