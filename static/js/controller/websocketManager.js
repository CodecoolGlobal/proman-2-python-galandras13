import { boardsManager } from "./boardsManager.js";
import { cardsManager } from "./cardsManager.js";

export const websocketManager = {
  socket: null,
  init: function () {
    if (this.socket == null) {
      this.socket = io();
      this.socket.on('something_happened', async function (event) {
        await boardsManager.refreshBoard(event.boardId);
      });
      this.socket.on('move_card', async function (event) {
        await cardsManager.showCurrentlyDraggedCard(event.cardId, event.position);
      });
    }
  },
  sendNewCard: function (boardId, newCardName) {
    this.socket.emit('create_card', { boardId, newCardName });
  },
  sendCardPosition: function (cardId, position) {
    this.socket.emit('move_card', { cardId, position });
  }
}

