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
VALUES (1, 'Laptop', 1500.00, 'High-performance laptop', true, 1, 1),
       (2, 'T-shirt', 20.99, 'Cotton T-shirt', true, 2, 2),
       (3, 'Java Book', 39.99, 'Introduction to Java programming', true, 3, 3);

-- Dodanie identyfikatorów do tabeli 'item_image'
INSERT INTO item_image (image_id, image, item_id)
VALUES (1, 'laptop_image.jpg', 1),
       (2, 'tshirt_image.jpg', 2),
       (3, 'javabook_image.jpg', 3);

-- Dodanie identyfikatorów do tabeli 'rent'
INSERT INTO rent (rent_id, lending_account_id, borrowing_account_id, item_id, total_cost, rent_time, return_time,
                  rent_status)
VALUES (1, 1, 2, 1, 50.00, CURRENT_TIMESTAMP, NULL, 'IN_RENT'),
       (2, 2, 1, 2, 10.00, CURRENT_TIMESTAMP, NULL, 'TO_ACCEPT'),
       (3, 3, 1, 3, 20.00, CURRENT_TIMESTAMP, NULL, 'TO_ACCEPT');

INSERT INTO opinion (opinion_id, item_id, description, feedback_target, rating, giver_account_id, receiver_account_id,
                     rent_id)
VALUES (1, 1, 'Great laptop, amazing performance!', 'LENDER', 5, 2, 1, 1),
       (2, 2, 'Nice quality T-shirt.', 'BORROWER', 4, 1, 2, 2),
       (3, 3, 'Excellent book, very informative.', 'LENDER', 5, 3, 1, 3);

