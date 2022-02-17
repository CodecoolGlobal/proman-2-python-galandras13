import { boardsManager } from "./controller/boardsManager.js";
import { historyManager } from "./controller/historyManager.js";


async function init () {
    await boardsManager.loadBoards();
    await boardsManager.createBoard();
    await historyManager.showHistory();
}

export async function reset () {
    const root = document.querySelector('#root');
    root.innerHTML = '';
    await init();
}

await init();
