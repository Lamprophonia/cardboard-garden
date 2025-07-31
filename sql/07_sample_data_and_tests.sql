-- Sample data and testing for hybrid architecture
-- This script adds sample users and collections to test the system

USE tcg_shared;

-- Insert sample users
INSERT INTO users (username, email, first_name, last_name) VALUES
('collector1', 'collector1@email.com', 'John', 'Smith'),
('cardmaster', 'cardmaster@email.com', 'Jane', 'Doe'),
('tcg_fan', 'tcgfan@email.com', 'Mike', 'Johnson');

-- Add some cards to user collections (referencing cards in game databases)
-- User 1 collects Pokémon
INSERT INTO collection (user_id, game_id, external_card_id, condition_id, quantity, purchase_price, purchase_date, notes) VALUES
(1, 1, 1, 2, 1, 350.00, '2024-01-15', 'First edition Charizard - centerpiece of collection'),
(1, 1, 2, 1, 4, 2.00, '2024-01-15', 'Playset of Energy Removal');

-- User 2 collects Magic
INSERT INTO collection (user_id, game_id, external_card_id, condition_id, quantity, purchase_price, purchase_date, notes) VALUES
(2, 2, 1, 1, 1, 25000.00, '2024-02-01', 'Holy grail - Black Lotus!'),
(2, 2, 2, 2, 4, 5.00, '2024-02-01', 'Lightning Bolt playset'),
(2, 2, 3, 3, 2, 15.00, '2024-02-01', 'Classic angels');

-- User 3 collects Lorcana
INSERT INTO collection (user_id, game_id, external_card_id, condition_id, quantity, purchase_price, purchase_date, notes) VALUES
(3, 4, 1, 1, 1, 45.00, '2024-03-01', 'Mickey Mouse - love the artwork'),
(3, 4, 2, 2, 1, 75.00, '2024-03-01', 'Elsa is so powerful'),
(3, 4, 3, 1, 3, 12.00, '2024-03-01', 'Great song card');

-- Add some wishlist items
INSERT INTO wishlist (user_id, game_id, external_card_id, priority, max_price, notes) VALUES
(1, 2, 1, 3, 20000.00, 'Dream card - saving up for Black Lotus'),
(2, 1, 1, 2, 300.00, 'Want to try Pokémon - Charizard looks cool'),
(3, 3, 1, 1, 10.00, 'Need Blue-Eyes for Yu-Gi-Oh deck');

-- Test queries to verify the system works

-- Show all users and their collection counts
SELECT 
    u.username,
    g.name as game,
    COUNT(c.id) as cards_owned,
    SUM(c.quantity) as total_quantity,
    SUM(c.purchase_price * c.quantity) as total_spent
FROM users u
LEFT JOIN collection c ON u.id = c.user_id
LEFT JOIN games g ON c.game_id = g.id
GROUP BY u.id, u.username, g.id, g.name
ORDER BY u.username, g.name;

-- Show user collection details with card names (requires cross-database joins)
SELECT 'Pokémon Collections:' as section;
SELECT 
    u.username,
    p.name as card_name,
    p.hp,
    pt.name as pokemon_type,
    cond.name as condition,
    c.quantity,
    c.purchase_price,
    c.notes
FROM collection c
JOIN users u ON c.user_id = u.id
JOIN games g ON c.game_id = g.id
JOIN tcg_pokemon.cards p ON c.external_card_id = p.id
LEFT JOIN tcg_pokemon.pokemon_types pt ON p.pokemon_type_id = pt.id
LEFT JOIN conditions cond ON c.condition_id = cond.id
WHERE g.name = 'Pokémon Trading Card Game';

SELECT 'Magic Collections:' as section;
SELECT 
    u.username,
    m.name as card_name,
    m.mana_cost,
    m.power,
    m.toughness,
    cond.name as condition,
    c.quantity,
    c.purchase_price,
    c.notes
FROM collection c
JOIN users u ON c.user_id = u.id
JOIN games g ON c.game_id = g.id
JOIN tcg_magic.cards m ON c.external_card_id = m.id
LEFT JOIN conditions cond ON c.condition_id = cond.id
WHERE g.name = 'Magic: The Gathering';

SELECT 'Lorcana Collections:' as section;
SELECT 
    u.username,
    l.name as card_name,
    l.ink_cost,
    l.strength,
    l.willpower,
    l.lore_value,
    ic.name as ink_color,
    f.name as franchise,
    cond.name as condition,
    c.quantity,
    c.purchase_price,
    c.notes
FROM collection c
JOIN users u ON c.user_id = u.id
JOIN games g ON c.game_id = g.id
JOIN tcg_lorcana.cards l ON c.external_card_id = l.id
LEFT JOIN tcg_lorcana.ink_colors ic ON l.ink_color_id = ic.id
LEFT JOIN tcg_lorcana.franchises f ON l.franchise_id = f.id
LEFT JOIN conditions cond ON c.condition_id = cond.id
WHERE g.name = 'Disney Lorcana';
