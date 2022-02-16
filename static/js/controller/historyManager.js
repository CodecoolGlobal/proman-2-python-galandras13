import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let historyManager = {
    showHistory: async function () {
        const histories = sessionStorage;
        console.log(sessionStorage);
        console.log(historyManager.historyListCounter);
    },
    historyListCounter: 0,
}