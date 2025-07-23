
export class UserStatus {

    private static readonly _connectedUsers: Set<string> = new Set();

    static addUser(userId: string): void {
        this._connectedUsers.add(userId);
    }

    static removeUser(userId: string): void {
        this._connectedUsers.delete(userId);
    }

    static isUserOnline(userId: string): boolean {
        return this._connectedUsers.has(userId);
    }

}


