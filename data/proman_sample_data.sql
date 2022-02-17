--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS users;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL,
    board_id INTEGER                NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    user_id     INTEGER
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL,
    archived    BOOLEAN             DEFAULT FALSE
);

CREATE TABLE users (
    id          SERIAL PRIMARY KEY  NOT NULL,
    username    VARCHAR(200)        NOT NULL,
    password    text
);

---
--- insert data
---

INSERT INTO boards(title, user_id) VALUES ('ProMan', 1);
INSERT INTO boards(title, user_id) VALUES ('Workflow', 1);
INSERT INTO boards(title, user_id) VALUES ('You can try it!', 1);

INSERT INTO statuses(title, board_id) VALUES ('Created by', 1);
INSERT INTO statuses(title, board_id) VALUES ('New features', 1);
INSERT INTO statuses(title, board_id) VALUES ('Monday', 2);
INSERT INTO statuses(title, board_id) VALUES ('Tuesday', 2);
INSERT INTO statuses(title, board_id) VALUES ('Wednesday', 2);
INSERT INTO statuses(title, board_id) VALUES ('Thursday', 2);
INSERT INTO statuses(title, board_id) VALUES ('', 3);
INSERT INTO statuses(title, board_id) VALUES ('', 3);
INSERT INTO statuses(title, board_id) VALUES ('', 3);
INSERT INTO statuses(title, board_id) VALUES ('', 3);

INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'András Gál', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'Márton Magai', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'Tamás Bosánszki', 3);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, '(+Gábor Hajdu)', 4);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Archive cards', 1, true);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'History of changes', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Manual sync', 3);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Live sync', 4);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Deployment', 5);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Offline access', 6);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 3, 'Git flow', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 3, 'Merge previous sprint', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'Archive cards', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'Refactor using builder pattern', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'PA', 1, true);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'Manual sync', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'Session history', 3);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'Offline access', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'Live sync', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'Refactor', 3);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'Deploy', 4);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 7, 'Thanks', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 8, 'For', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 9, 'Your', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 10, 'Attention!', 1);


INSERT INTO statuses(title, board_id) VALUES ('new', 4);
INSERT INTO statuses(title, board_id) VALUES ('in progress', 4);
INSERT INTO statuses(title, board_id) VALUES ('testing', 4);
INSERT INTO statuses(title, board_id) VALUES ('done', 4);
INSERT INTO statuses(title, board_id) VALUES ('new', 5);
INSERT INTO statuses(title, board_id) VALUES ('in progress', 5);
INSERT INTO statuses(title, board_id) VALUES ('testing', 5);
INSERT INTO statuses(title, board_id) VALUES ('done', 5);

INSERT INTO boards(title) VALUES ('Board 1');
INSERT INTO boards(title) VALUES ('Board 2');

INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 11, 'new card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 11, 'new card 2', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 12, 'in progress card', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 13, 'planning', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 14, 'done card 1', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 14, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 4, 14, 'done card 1', 3);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 5, 15, 'new card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 5, 15, 'new card 2', 3);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 5, 16, 'in progress card', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 5, 17, 'planning', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 5, 18, 'done card 1', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 5, 18, 'done card 1', 3);

INSERT INTO users(username, password)  VALUES ('admin', '$2b$12$T.dBeyku3wmmBW57N0qxkeIGU6shrmBJebokl0//0JhgXrqnRog4.');

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;

ALTER TABLE ONLY statuses
    ADD CONSTRAINT fk_statuses_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;
