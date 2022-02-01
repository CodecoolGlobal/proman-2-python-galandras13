import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
  loadBoards: async function () {
    const boards = await dataHandler.getBoards();
    for (let board of boards) {
      const boardBuilder = htmlFactory(htmlTemplates.board);
      const content = boardBuilder(board);
      domManager.addChild("#root", content);
      domManager.addEventListener(`.toggle-board-button[data-board-id="${board.id}"]`,
          "click", showHideButtonHandler);
    }
  },
  loadStatuses: async function (){
    return await dataHandler.getStatuses()
  },
};

async function showHideButtonHandler(clickEvent) {
  const boardId = clickEvent.target.dataset.boardId;
  const columContainer = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
  columContainer.classList.toggle("show");
  if (columContainer.classList.contains("show")) {
    await showCards(boardId);
    await cardsManager.loadCards(boardId);
  } else {
    await hideCards(boardId);
  }
}

const showCards = async (boardId) => {
  let statuses = await boardsManager.loadStatuses();
  for (let status of statuses) {
    const statusBuilder = htmlFactory(htmlTemplates.status);
    const content = statusBuilder(status, boardId);
    domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content);
  }
}

const hideCards = async (boardId) => {
  const statusContainer = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
  statusContainer.innerHTML = "";
}
