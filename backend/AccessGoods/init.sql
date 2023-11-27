CREATE TABLE category
(
    category_id BIGINT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE account
(
    account_id   BIGINT PRIMARY KEY,
    email        VARCHAR(255) NOT NULL,
    first_name   VARCHAR(255),
    last_name    VARCHAR(255),
    phone_number VARCHAR(20),
    created_at   TIMESTAMP,
    modified_at  TIMESTAMP,
    is_enabled   BOOLEAN,
    role         VARCHAR(20),
    password     VARCHAR(255)
);

CREATE TABLE item
(
    item_id     BIGINT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    cost        REAL,
    description VARCHAR(255),
    is_active   BOOLEAN,
    account_id  bigint,
    category_id  bigint,
    FOREIGN KEY (account_id) REFERENCES account (account_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE CASCADE
);

CREATE TABLE item_image
(
    image_id BIGINT PRIMARY KEY,
    image    VARCHAR(255),
    item_id  BIGINT,
    FOREIGN KEY (item_id) REFERENCES item (item_id) ON DELETE CASCADE
);


CREATE TABLE rent
(
    rent_id              BIGINT PRIMARY KEY,
    lending_account_id   BIGINT,
    borrowing_account_id BIGINT,
    item_id              BIGINT,
    total_cost           FLOAT,
    rent_time            TIMESTAMP,
    return_time          TIMESTAMP,
    rent_status          VARCHAR(20),
    FOREIGN KEY (lending_account_id) REFERENCES account (account_id) ON DELETE CASCADE,
    FOREIGN KEY (borrowing_account_id) REFERENCES account (account_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES item (item_id) ON DELETE CASCADE
);
create table opinion
(
    item_id             bigint not null
        primary key,
    description         varchar(255),
    feedback_target     varchar(20),
    rating              integer,
    giver_account_id    bigint,
    receiver_account_id bigint,
    FOREIGN KEY (giver_account_id) REFERENCES account (account_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_account_id) REFERENCES account (account_id) ON DELETE CASCADE
);

-- Dodanie identyfikatorów do tabeli 'category'
INSERT INTO category (category_id, name, description)
VALUES (1, 'Electronics', 'Category for electronic devices'),
       (2, 'Clothing', 'Category for clothing items'),
       (3, 'Books', 'Category for books');

-- Dodanie identyfikatorów do tabeli 'account'
INSERT INTO account (account_id, email, first_name, last_name, phone_number, created_at, modified_at, is_enabled, role,
                     password)
VALUES (1, 'user1@example.com', 'John', 'Doe', '123456789', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'CLIENT',
        '$2a$10$g./tpPdwwiQdxOrJbjWhpeaRJJdc21ZpziLyvphvpb6aOH6vYBWHW'),
       (2, 'user2@example.com', 'Alice', 'Smith', '987654321', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'MANAGER',
        '$2a$10$g./tpPdwwiQdxOrJbjWhpeaRJJdc21ZpziLyvphvpb6aOH6vYBWHW'),
       (3, 'admin@example.com', 'Admin', 'Admin', '555555555', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true, 'ADMIN',
        '$2a$10$g./tpPdwwiQdxOrJbjWhpeaRJJdc21ZpziLyvphvpb6aOH6vYBWHW');

-- Dodanie identyfikatorów do tabeli 'item'
INSERT INTO item (item_id, name, cost, description, is_active, account_id, category_id)
VALUES (1, 'Laptop', 1500.00, 'High-performance laptop', true, 1,1),
       (2, 'T-shirt', 20.99, 'Cotton T-shirt', true, 2,2),
       (3, 'Java Book', 39.99, 'Introduction to Java programming', true, 3,3);

-- Dodanie identyfikatorów do tabeli 'item_image'
INSERT INTO item_image (image_id, image, item_id)
VALUES (1, 'laptop_image.jpg', 1),
       (2, 'tshirt_image.jpg', 2),
       (3, 'javabook_image.jpg', 3);

-- Dodanie identyfikatorów do tabeli 'rent'
INSERT INTO rent (rent_id, lending_account_id, borrowing_account_id, item_id, total_cost, rent_time, return_time,
                  rent_status)
VALUES (1, 1, 2, 1, 50.00, CURRENT_TIMESTAMP, NULL, 'IN_RENT'),
       (2, 2, 1, 2, 10.00, CURRENT_TIMESTAMP, NULL, 'START'),
       (3, 3, 1, 3, 20.00, CURRENT_TIMESTAMP, NULL, 'START');

INSERT INTO opinion (item_id, description, feedback_target, rating, giver_account_id, receiver_account_id)
VALUES
    (1, 'Great laptop, amazing performance!', 'LENDER', 5, 2, 1),
    (2, 'Nice quality T-shirt.', 'BORROWER', 4, 1, 2),
    (3, 'Excellent book, very informative.', 'LENDER', 5, 3, 1);

-- auto-generated definition
create sequence account_seq
    start 4
    increment by 1;

alter sequence account_seq owner to postgres;

-- auto-generated definition
create sequence category_seq
    start 4
    increment by 1;

alter sequence category_seq owner to postgres;

-- auto-generated definition
create sequence item_image_seq
    start 4
    increment by 1;

alter sequence item_image_seq owner to postgres;

-- auto-generated definition
create sequence item_seq
    start 4
    increment by 1;

alter sequence item_seq owner to postgres;

-- auto-generated definition
create sequence rent_seq
    start 4
    increment by 1;

alter sequence rent_seq owner to postgres;

create sequence opinion_seq
    start 4
    increment by 1;

alter sequence opinion_seq owner to postgres;



