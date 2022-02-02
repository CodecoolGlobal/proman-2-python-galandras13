import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    # remove this code once you implement the database
    # return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def get_board_by_id(board_id):
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE boards.id = %(board_id)s
        """, {'board_id': board_id}, fetchall=False
    )


def get_statuses():
    return data_manager.execute_select(
        """
        SELECT id, title FROM statuses
        ;
        """
    )


def get_status_by_status_id(status_id):
    return data_manager.execute_select(
        """
        SELECT id, title FROM statuses
        WHERE id = %(status_id)s
        ;
        """, {"status_id": status_id}, fetchall=False
    )


def get_card_by_id(card_id):
    return data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE id = %(card_id)s""", {'card_id': card_id}, fetchall=False)


def create_user(username, password):
    data_manager.execute_select(
        """
        INSERT INTO users(id, username, password)
        VALUES (default, %(username)s, %(password)s)
        """, {'username': username, "password": password}, select=False)


def get_user(username):
    result = data_manager.execute_select(
        """
        SELECT *
        FROM users
        WHERE username = %(username)s;
        """, {"username": username}, fetchall=False)
    return result


def update_card_by_card_id(card_id, card_order, status_id):
    data_manager.execute_update(
        """
        UPDATE cards
        SET 
        card_order = %(card_order)s,
        status_id = %(status_id)s
        WHERE id = %(card_id)s
        """, {'card_id': card_id, 'card_order': card_order, 'status_id': status_id})
