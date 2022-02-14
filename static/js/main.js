import { boardsManager } from "./controller/boardsManager.js";

let socket;

async function init () {
  await boardsManager.loadBoards();
  await boardsManager.createBoard();

  if (socket == null) {
    socket = io();
    socket.on('connect', function () {
      socket.emit('my event', { data: 'I\'m connected!' });
    });
  }
}

export async function reset () {
  const root = document.querySelector('#root')
  root.innerHTML = ''
  await init()
}

await init();
