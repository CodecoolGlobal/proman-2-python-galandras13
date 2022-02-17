export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    // getBoard: async function (boardId) {
    //   // the board is retrieved and then the callback function is called with the board
    //   return await apiGet(`/api/boards/${boardId}`);
    // },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
        return await apiGet("/api/statuses/");
    },
    // getStatus: async function (statusId) {
    //   // the status is retrieved and then the callback function is called with the status
    //   return await apiGet(`/api/statuses/${statusId}`);
    // },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    // getCard: async function (cardId) {
    //   // the card is retrieved and then the callback function is called with the card
    //   return await apiGet(`/api/cards/${cardId}`);
    // },
    createNewBoard: async function (boardTitle, userId) {
        // creates new board, saves it and calls the callback function with its data
        const payload = { "board_title": boardTitle, "user_id": userId }
        await apiPost('/api/newBoards', payload)
    },
    updateBoardTitle: async function (boardId, updatedBoardTitle) {
        const payload = { "new_title": updatedBoardTitle };
        await apiPut(`/api/modifiedBoards/${boardId}`, payload);
    },
    deleteBoard: async function (boardId) {
        await apiDelete(`/api/boards/${boardId}`);
    },
    createNewColumn: async function (boardId, newColumnTitle) {
        // creates new card, saves it and calls the callback function with its data
        const payload = { "board_id": boardId, "new_column_title": newColumnTitle };
        await apiPost(`/api/add-new-column`, payload);
    },
    updateCards: async function (payload) {
        await apiPost(`/api/update/card`, payload);
    },
    deleteCard: async function (cardId) {
        await apiDelete(`/api/cards/${cardId}`);
    },
    deleteColumn: async function (boardId, statusId) {
        await apiDelete(`/api/columns/${boardId}/${statusId}`);
    },
    createNewCard: async function (boardId, newCardName) {
        const payload = { "new_card_name": newCardName };
        await apiPost(`/api/${boardId}/create-card`, payload)
    },
    renameCard: async function (cardId, modifiedTitle = null) {
        const payload = { "modified_title": modifiedTitle }
        await apiPut(`/api/cards/${cardId}`, payload)
    },
    renameColumn: async function (statusId, modifiedTitle = null) {
        const payload = { "modified_title": modifiedTitle }
        await apiPut(`/api/columns/${statusId}`, payload)
    }
};

async function apiGet (url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.status === 200) {
        return response.json();
    }
}

async function apiPost (url, payload) {
    await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(payload)
    });

}

async function apiDelete (url, payload = "") {
    await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify(payload)
    });
}

async function apiPut (url, payload = "") {
    await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}
