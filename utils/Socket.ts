import { io, Socket } from "socket.io-client";
import type { Card, User } from "types";
import { updateColumn, type Column } from "~/columns/columns";

class SocketClient {
    private socket: Socket;
    private room: string;

    constructor(serverUrl: string, room: string) {
        this.socket = io(serverUrl, {
            transports: ["websocket"],
        });
        this.room = room;

        this.socket.on("connect", () => {
            console.log(`Connected to server with ID: ${this.socket.id}`);
            this.joinRoom();
        });

        this.socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });
    }

    private joinRoom(): void {
        this.socket.emit("joinRoom", this.room);
        this.socket.on("room.join", (message: string) => {
            console.log(message);
        });
    }

    leaveRoom(): void {
        this.socket.emit("leaveRoom", this.room);
        this.socket.on("room.leave", (message: string) => {
            console.log(message);
        });
    }

    addCard(card: any): void {
        this.socket.emit("card.add", this.room, card);
    }

    updateCard(cardId: string, updatedCard: any): void {
        if (!cardId || !updatedCard) {
            console.error("Card ID and updated card data are required to update a card.");
            return;
        }
        console.log(`Updating card with ID: ${cardId}`);
        this.socket.emit("card.update", this.room, cardId, updatedCard);
    }

    removeCard(cardId: string): void {
        if (!cardId) {
            console.error("Card ID is required to remove a card.");
            return;
        }
        console.log(`Removing card with ID: ${cardId}`);
        this.socket.emit("card.remove", this.room, cardId);
    }

    updateUser(user: User): void {
        this.socket.emit("user.update", this.room, user);
    }

    updatecolumn(columnToUpdate: string, newColumn: Column): void {
        this.socket.emit("column.update", this.room, columnToUpdate, newColumn);
    }

    onRoomJoin(callback: (message: string) => void): void {
        this.socket.on("room.join", callback);
    }

    onRoomLeave(callback: (message: string) => void): void {
        this.socket.on("room.leave", callback);
    }

    onCardAdd(callback: (card: Card) => void): void {
        this.socket.on("card.added", callback);
    }

    onCardUpdate(callback: (cardId: string, card: Card) => void): void {
        this.socket.on("card.updated", callback);
    }

    onCardRemove(callback: (cardId: string) => void): void {
        this.socket.on("card.removed", callback);
    }

    onCardInitialized(callback: (cards: Card[]) => void): void {
        this.socket.on("cards.initial", callback);
    }

    onUserUpdate(callback: (user: any) => void): void {
        this.socket.on("user.updated", callback);
    }

    onColumnUpdate(callback: (columnName: string, newColumn: Column) => void): void {
        this.socket.on("column.updated", callback);
    }

    disconnect(): void {
        this.leaveRoom();
        this.socket.disconnect();
    }
}

export default SocketClient;