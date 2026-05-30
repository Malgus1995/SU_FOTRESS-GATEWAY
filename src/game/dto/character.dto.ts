import { ApiProperty } from '@nestjs/swagger';

export class SelectCharacterDto {
  @ApiProperty({
    example: 'player1',
  })
  playerId: string;

  @ApiProperty({
    example: 'tank01',
  })
  characterId: string;
}