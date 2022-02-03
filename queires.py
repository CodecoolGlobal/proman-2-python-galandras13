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


def get_boards(user_id=None):
    """
    Gather all boards
    :return:
    """
    # remove this code once you implement the database
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        f"""
        SELECT * FROM boards
        WHERE user_id IS NULL {'OR user_id= ' + str(user_id) if user_id else ''}
        ORDER BY id;
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
        SELECT id, title, board_id FROM statuses
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


def create_board(title, user_id=None):
    if user_id:
        board_id = data_manager.execute_select(
            """
            INSERT INTO boards(id, title, user_id)
            VALUES (default, %(title)s, %(user_id)s)
            RETURNING id;
            """, {"title": title, "user_id": user_id}, fetchall=False)['id']
    else:
        board_id = data_manager.execute_select(
            """
            INSERT INTO boards(id, title)
            VALUES (default, %(title)s)
            RETURNING id;
            """, {"title": title}, fetchall=False)['id']
    init_statuses(board_id)


def modify_board_title(board_id, modified_name):
    data_manager.execute_select(
        """
        UPDATE boards
        SET title = %(modified_name)s
        WHERE id = %(board_id)s
        """, {"modified_name": modified_name, "board_id": board_id}, select=False)


def init_statuses(board_id):
    default_statuses = ['new', 'in progress', 'testing', 'done']
    for i in range(4):
        create_status(default_statuses[i], board_id)


def create_status(title, board_id):
    data_manager.execute_select(
        """
        INSERT INTO statuses(title, board_id)
        VALUES (%(title)s, %(board_id)s)
        """, {'title': title, 'board_id': board_id}, select=False
    )


def delete_card(card_id):
    data_manager.execute_select(
        """
        DELETE
        FROM cards
        WHERE id = %(card_id)s;
        """, {"card_id": card_id}, select=False)


def delete_board(board_id):
    data_manager.execute_select(
        """
        DELETE
        FROM boards
        WHERE id = %(board_id)s;
        """, {"board_id": board_id}, select=False)


def delete_columns(status_id):
    data_manager.execute_select(
        """
        DELETE
        FROM statuses
        WHERE id = %(id)s
        """, {"id": status_id}, select=False)


def delete_column_cards(board_id, status_id):
    data_manager.execute_select(
        """
        DELETE
        FROM cards
        WHERE board_id = %(board_id)s AND status_id = %(status_id)s
        """, {"board_id": board_id, "status_id": status_id}, select=False)
