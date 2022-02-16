import { dataHandler } from "../data/dataHandler.js";
import { htmlFactory, htmlTemplates } from "../view/htmlFactory.js";
import { domManager } from "../view/domManager.js";
import { cardsManager } from "./cardsManager.js";

export let historyManager = {
    showHistory: async function () {
        let sessionStorageKeys = Object.keys(sessionStorage).sort( function ( a, b ) { return parseInt(b) - parseInt(a); } ).reduce(
            (obj, key) => {
                obj[key] = sessionStorage[key];
                return obj;
            },
            {}
        );
        console.log(sessionStorageKeys);
        console.log(sessionStorage);
        await clearHistoryList();
        await fillHistoryList(sessionStorageKeys);
    },
}

const fillHistoryList = async (sessionStorageKeys) => {
    for (let i = 0; i < sessionStorage.length; i++) {
        let sessionStorageKey = Object.keys(sessionStorageKeys)[i];
        if (sessionStorageKey.includes("newCard")) {
            const boardNameOfCreatedCard = JSON.parse(sessionStorageKeys[sessionStorageKey])["boardName"];
            const createdCardName = JSON.parse(sessionStorageKeys[sessionStorageKey])['cardName'];
            const showHistoryCreateBuilder = htmlFactory(htmlTemplates.showHistory);
            const historyCreateContent = showHistoryCreateBuilder("created", boardNameOfCreatedCard, createdCardName);
            domManager.addChild(`.session-history-list`, historyCreateContent);
        } else if (sessionStorageKey.includes("deleteCard")) {
            const boardNameOfDeletedCard = JSON.parse(sessionStorageKeys[sessionStorageKey]).boardName;
            const DeletedCardName = JSON.parse(sessionStorageKeys[sessionStorageKey]).cardName;
            const showHistoryDeleteBuilder = htmlFactory(htmlTemplates.showHistory);
            const historyDeleteContent = showHistoryDeleteBuilder("deleted", boardNameOfDeletedCard, DeletedCardName);
            domManager.addChild(`.session-history-list`, historyDeleteContent);
        } else if (sessionStorageKey.includes("updateCard")) {
            const modifiedTitle = JSON.parse(sessionStorageKeys[sessionStorageKey]).cardName;
            const previousTitle = JSON.parse(sessionStorageKeys[sessionStorageKey]).previousTitle;
            const statusName = JSON.parse(sessionStorageKeys[sessionStorageKey]).statusName;
            const showHistoryUpdateBuilder = htmlFactory(htmlTemplates.showHistoryUpdate);
            const historyContent = showHistoryUpdateBuilder(statusName, modifiedTitle, previousTitle);
            domManager.addChild(`.session-history-list`, historyContent);
        }
    }
}

const clearHistoryList = () => {
    const historyList = document.querySelector(".session-history-list");
    historyList.innerHTML = "";
}