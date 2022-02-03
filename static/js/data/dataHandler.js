export let dataHandler = {
  getBoards: async function () {
    const response = await apiGet("/api/boards");
    return response;
  },
  getBoard: async function (boardId) {
    // the board is retrieved and then the callback function is called with the board
    const response = await apiGet(`/api/boards/${boardId}`);
    return response;
  },
  getStatuses: async function () {
    // the statuses are retrieved and then the callback function is called with the statuses
    const response = await apiGet("/api/statuses/");
    return response;
  },
  getStatus: async function (statusId) {
    // the status is retrieved and then the callback function is called with the status
    const response = await apiGet(`/api/statuses/${statusId}`);
    return response;
  },
  getCardsByBoardId: async function (boardId) {
    const response = await apiGet(`/api/boards/${boardId}/cards/`);
    return response;
  },
  getCard: async function (cardId) {
    // the card is retrieved and then the callback function is called with the card
    const response = await apiGet(`/api/cards/${cardId}`);
    return response;
  },
  createNewBoard: async function (boardTitle, userId) {
    // creates new board, saves it and calls the callback function with its data
    const payload = {"board_title": boardTitle, "user_id": userId}
    await apiPost('/api/newBoards', payload)
  },
  updateBoardTitle: async function (boardId, updatedBoardTitle) {
    const payload = {"new_title": updatedBoardTitle};
    await apiPut(`/api/modifiedBoards/${boardId}`, payload);
  },
  deleteBoard: async function (boardId) {
    await apiDelete(`/api/boards/${boardId}`);
  },
  createNewCard: async function (boardId, newColumnTitle) {
    // creates new card, saves it and calls the callback function with its data
    const payload = {"board_id": boardId, "new_column_title": newColumnTitle};
    await apiPost(`/api/add-new-column`, payload);
  },
  updateCards: function (payload) {
    apiPost(`/api/update/card`, payload);
  }
};

async function apiGet(url) {
  let response = await fetch(url, {
    method: "GET",
  });
  if (response.status === 200) {
    let data = response.json();
    return data;
  }
}

async function apiPost(url, payload) {
  await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify(payload)
  });

}

async function apiDelete(url, payload="") {
    await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'},
      method: 'DELETE',
      body: JSON.stringify(payload)
  });
}

async function apiPut(url, payload="") {
    await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'},
      method: 'PUT',
      body: JSON.stringify(payload)
  });
}
