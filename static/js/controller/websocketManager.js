import { boardsManager } from "./boardsManager.js";

export const websocketManager = {
  socket: null,
  init: function () {
    if (this.socket == null) {
      this.socket = io();
      this.socket.on('connect', () => {
        this.socket.emit('my event', { data: 'I\'m connected!' });
      });
      this.socket.on('something_happened', async function (event) {
        await boardsManager.refreshBoard(event.boardId);
      });
    }
  },
  sendNewCard: function (boardId, newCardName) {
    this.socket.emit('create_card', { data: { boardId, newCardName } });
  }
}