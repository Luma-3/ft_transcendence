export interface PayloadUserSocketMsg {
    type: 'pending' | 'alert' | 'render' | 'redirect';
    action: string;
    data: string; // is userId
}

function dispatchPending(action: string, userId: string) {
    switch (action) {
        case 'add':
            alert(`Pending request from user ${userId}`);
            break;
        case 'remove':
            alert(`Pending request removed from user ${userId}`);
            break;
        case 'accept':
            alert(`Pending request accepted from user ${userId}`);
            break;
        case 'refuse':
            alert(`Pending request refused from user ${userId}`);
            break;
        default:
            console.error(`Unknown pending action: ${action}`);
    }
}

export function dispatchUserSocketMsg(payload: PayloadUserSocketMsg) {
    const { type, action, data } = payload;

    switch (type) {
        case 'pending':
            dispatchPending(action, data);
            break;

    }
}
