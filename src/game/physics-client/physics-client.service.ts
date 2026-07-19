import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import type {
  GameSnapshot,
  PhysicsCommandResponse,
  PlayerCommand,
} from '../common/types/snapshots';

@Injectable()
export class PhysicsClientService {
  private readonly logger =
    new Logger(
      PhysicsClientService.name,
    );

  private readonly baseUrl =
    process.env.PHYSICS_URL ??
    'http://localhost:3001';

  async processCommand(
    snapshot: GameSnapshot,
    command: PlayerCommand,
  ): Promise<GameSnapshot> {
    let response: Response;

    try {
      response =
        await fetch(
          `${this.baseUrl}/physics/process-command`,
          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({
                snapshot,
                command,
              }),

            signal:
              AbortSignal.timeout(
                3000,
              ),
          },
        );
    } catch (error) {
      this.logger.error(
        'Physics service connection failed',
        error instanceof Error
          ? error.stack
          : String(error),
      );

      throw new ServiceUnavailableException(
        'Physics service unavailable',
      );
    }

    if (!response.ok) {
      const body =
        await response.text();

      this.logger.error(
        `Physics error: ${response.status} ${body}`,
      );

      throw new ServiceUnavailableException(
        'Physics command failed',
      );
    }

    const result =
      (await response.json()) as
        PhysicsCommandResponse;

    if (!result.snapshot) {
      throw new ServiceUnavailableException(
        'Invalid Physics response',
      );
    }

    return result.snapshot;
  }
}