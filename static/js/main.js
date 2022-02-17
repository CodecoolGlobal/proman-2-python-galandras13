import { boardsManager } from "./controller/boardsManager.js";
import { websocketManager } from "./controller/websocketManager.js";
import { historyManager } from "./controller/historyManager.js";

async function init () {
    await boardsManager.loadBoards();
    await boardsManager.createBoard();
    await historyManager.showHistory();
    websocketManager.init();
}

export async function reset () {
    const root = document.querySelector('#root');
    root.innerHTML = '';
    await init();
}

await init();
