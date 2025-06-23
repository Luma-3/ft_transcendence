import { redisPub, redisSub } from './redis.js';

export class IOInterface {
  private constructor() { }

  public static send(message: string, target: string): void {
    redisPub.publish(`ws:gateway:out:${target}`, message);
  }

  public static broadcast(message: string, target: string[]): void {
    target.forEach((playerId) => {
      redisPub.publish(`ws:gateway:out:${playerId}`, message);
    });
  }

  public static subscribe(channel: string, callback: (message: string) => void): void {
    redisSub.subscribe(channel, (message) => {
      callback(message);
    });
  }

  public static unsubscribe(channel: string): void {
    redisSub.unsubscribe(channel);
  }
}

