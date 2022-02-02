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
  createNewBoard: async function (boardTitle) {
    // creates new board, saves it and calls the callback function with its data
  },
  createNewCard: async function (cardTitle, boardId, statusId) {
    // creates new card, saves it and calls the callback function with its data
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

function apiPost(url, payload) {
  let response = fetch(url, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  // if (response.status === 200) {
  //   return response.json();
  // }
}

async function apiDelete(url) {}

async function apiPut(url) {}
