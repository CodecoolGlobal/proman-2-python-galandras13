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

function showHideButtonHandler(clickEvent) {
  console.log(clickEvent.target.dataset.boardId)
  console.log(clickEvent.target.dataset)
  console.log(clickEvent.target)
  const boardId = clickEvent.target.dataset.boardId;
  // let statuses = boardsManager.loadStatuses();
  // for (let status of statuses) {
  //
  // }

  cardsManager.loadCards(boardId);
}
