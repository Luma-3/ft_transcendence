import { redisPub, redisSub } from './redis.js';

export class IOInterface {
  private constructor() { }

  public static send(message: string, target: string): void {
    redisPub.publish(`game:gateway:out:${target}`, message);
  }

  public static broadcast(message: string, target: string[]): void {
    target.forEach((playerId) => {
      redisPub.publish(`game:gateway:out:${playerId}`, message);
    });
  }

  public static subscribe(channel: string, callback: (message: string, channel?: string) => void): void {
    redisSub.subscribe(channel, callback);
  }
  public static unsubscribe(channel: string): void {
    redisSub.unsubscribe(channel);
  }
}

