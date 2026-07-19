export interface PlayerSnapshot {
  id: string;

  x: number;
  y: number;

  hp: number;
  maxHp: number;

  fuel: number;
  maxFuel: number;

  alive: boolean;

  facing: 1 | -1;
}

export interface TurnActionSnapshot {
  moved: boolean;
  attacked: boolean;
}

export interface GameSnapshot {
  version: number;

  currentTurn: string;

  winner: string | null;

  players: PlayerSnapshot[];

  turnAction: TurnActionSnapshot;
}

export type MoveCommand = {
  type: 'MOVE';
  playerId: string;
  direction: 1 | -1;
};

export type AttackCommand = {
  type: 'ATTACK';

  playerId: string;

  angle: number;
  power: number;
};

export type EndTurnCommand = {
  type: 'END_TURN';

  playerId: string;
};

export type PlayerCommand =
  | MoveCommand
  | AttackCommand
  | EndTurnCommand;

export interface PhysicsCommandResponse {
  snapshot: GameSnapshot;
}