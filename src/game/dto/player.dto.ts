import { ApiProperty } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({
    example: 'player1',
  })
  id: string;
}

export class MovePlayerDto {
  @ApiProperty({
    example: 'player1',
  })
  id: string;

  @ApiProperty({
    example: 100,
  })
  x: number;

  @ApiProperty({
    example: 200,
  })
  y: number;
}