
import { redisPub } from "../../utils/redis.js";

export class NetworkGameInterface {
  private clients: string[] = []; // List of connected clients

  public addClient(clientId: string): void {
    if (!this.clients.includes(clientId)) {
      this.clients.push(clientId);
      console.log(`Client ${clientId} added.`);
    } else {
      console.log(`Client ${clientId} is already connected.`);
    }
  }

  public removeClient(clientId: string): void {
    const index = this.clients.indexOf(clientId);
    if (index !== -1) {
      this.clients.splice(index, 1);
      console.log(`Client ${clientId} removed.`);
    } else {
      console.log(`Client ${clientId} not found.`);
    }
  }

  public sendMessage(clientId: string, message: any): void {
    if (this.clients.includes(clientId)) {
      redisPub.publish('ws.game.out', JSON.stringify({
        user_id: clientId,
        payload: message
      }));
      // console.log(`Sending message to ${clientId}:`, message);
    } else {
      console.log(`Client ${clientId} is not connected.`);
    }
  }

  public broadcast(message: any): void {
    this.clients.forEach(clientId => {
      this.sendMessage(clientId, message);
    });
    // console.log("Broadcasting message to all clients:", message);
  }
}
