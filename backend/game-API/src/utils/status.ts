import { redisSubDuplicate } from "../utils/redis.js";

export class UserStatus {

    private static readonly _connectedUsers: Set<string> = new Set();

    static addUser(userId: string): void {
        this._connectedUsers.add(userId);
        console.table(this._connectedUsers.values());
    }

    static removeUser(userId: string): void {
        this._connectedUsers.delete(userId);
    }

    static isUserOnline(userId: string): boolean {
        return this._connectedUsers.has(userId);
    }

    static listenToUserStatusChanges(): void {
        redisSubDuplicate.subscribe('ws:all:broadcast:all', (message) => {
            console.log(`[Redis] Received user status change: ${message}`);
            const { user_id, type } = JSON.parse(message);
            if (type === 'connected') {
                UserStatus.addUser(user_id);
            } else if (type === 'disconnected' || type === 'error') {
                UserStatus.removeUser(user_id);
            }
        });
    }
}


