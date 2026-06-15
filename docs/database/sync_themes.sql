-- Theme Synchronization Script
-- Generated: 2026-06-14T08:05:42.263Z
-- Instructions: Copy and paste this script into the Supabase SQL Editor and hit 'Run'

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal01', 'Cinematic Ocean Depth 5', 'Minimalist', 150000, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral01', 'Cinematic Spring Blossom 4', 'Floral', 150000, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral02', 'Cinematic Winter Frost 2', 'Floral', 140000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark01', 'Cinematic Spring Blossom 3', 'Dark', 190000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury01', 'Cinematic Spring Blossom 2', 'Elegant', 150000, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal02', 'Cinematic Regal Purple 2', 'Minimalist', 100000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark02', 'Cinematic Midnight Gold 1', 'Dark', 180000, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral03', 'Cinematic Forest Mint 3', 'Floral', 140000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral04', 'Cinematic Regal Purple 1', 'Floral', 130000, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury02', 'Cinematic Ocean Depth 4', 'Elegant', 100000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal03', 'Cinematic Ocean Depth 3', 'Minimalist', 160000, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral05', 'Cinematic Ocean Depth 2', 'Floral', 140000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic01', 'Islamic Heritage', 'Islamic', 175000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark03', 'Cinematic Midnight Gold 7', 'Dark', 160000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury03', 'Cinematic Regal Purple 4', 'Elegant', 130000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal04', 'Cinematic Forest Mint 12', 'Minimalist', 190000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury04', 'Cinematic Regal Purple 15', 'Elegant', 160000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury05', 'Cinematic Regal Purple 14', 'Elegant', 160000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic02', 'Cinematic Ocean Depth 12', 'Islamic', 170000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal05', 'Cinematic Spring Blossom 16', 'Minimalist', 130000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic03', 'Cinematic Rose Gold 8', 'Islamic', 100000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal06', 'Cinematic Spring Blossom 15', 'Minimalist', 100000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury06', 'Cinematic Regal Purple 13', 'Elegant', 110000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark04', 'Cinematic Forest Mint 11', 'Dark', 140000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury07', 'Cinematic Ocean Depth 11', 'Elegant', 150000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal07', 'Cinematic Ocean Depth 10', 'Minimalist', 130000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic04', 'Cinematic Autumn Rustic 8', 'Islamic', 170000, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral06', 'Cinematic Spring Blossom 14', 'Floral', 180000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral07', 'Cinematic Winter Frost 1', 'Floral', 110000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral08', 'Cinematic Forest Mint 10', 'Floral', 140000, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal08', 'Cinematic Forest Mint 9', 'Minimalist', 150000, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral09', 'Cinematic Midnight Gold 6', 'Floral', 190000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal09', 'Cinematic Winter Frost 10', 'Minimalist', 170000, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal10', 'Cinematic Regal Purple 12', 'Minimalist', 150000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark05', 'Cinematic Winter Frost 9', 'Dark', 130000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral10', 'Cinematic Autumn Rustic 7', 'Floral', 120000, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic05', 'Cinematic Regal Purple 11', 'Islamic', 100000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark06', 'Cinematic Spring Blossom 13', 'Dark', 130000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury08', 'Cinematic Winter Frost 8', 'Elegant', 190000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic06', 'Cinematic Winter Frost 7', 'Islamic', 160000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal11', 'Classic White', 'Minimalist', 110000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral11', 'Cinematic Winter Frost 11', 'Floral', 150000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic07', 'Cinematic Midnight Gold 8', 'Islamic', 120000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury09', 'Cinematic Spring Blossom 17', 'Elegant', 150000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic08', 'Cinematic Forest Mint 2', 'Islamic', 180000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal12', 'Cinematic Forest Mint 8', 'Minimalist', 140000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury10', 'Cinematic Autumn Rustic 1', 'Elegant', 170000, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral12', 'Cinematic Forest Mint 1', 'Floral', 120000, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal13', 'Cinematic Ocean Depth 1', 'Minimalist', 180000, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark07', 'Cinematic Rose Gold 1', 'Dark', 130000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic09', 'Cinematic Spring Blossom 1', 'Islamic', 140000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal14', 'Cinematic Autumn Rustic 9', 'Minimalist', 140000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury11', 'Autumn Sunset', 'Premium', 160000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury12', 'Magical Fairytale', 'Premium', 175000, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury13', 'Winter Romance', 'Premium', 150000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral13', 'Floral Bliss', 'Floral', 125000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal15', 'Clean Vanilla', 'Minimalist', 99000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury14', 'Cinematic Spring Blossom 12', 'Elegant', 170000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark08', 'Cinematic Forest Mint 7', 'Dark', 120000, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark09', 'Cinematic Midnight Gold 5', 'Dark', 160000, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark10', 'Cinematic Spring Blossom 11', 'Dark', 180000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury15', 'Cinematic Rose Gold 7', 'Elegant', 150000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal16', 'Cinematic Winter Frost 6', 'Minimalist', 160000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral14', 'Cinematic Spring Blossom 10', 'Floral', 120000, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral15', 'Cinematic Rose Gold 6', 'Floral', 110000, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral16', 'Cinematic Regal Purple 10', 'Floral', 100000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark11', 'Cinematic Rose Gold 5', 'Dark', 160000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal17', 'Cinematic Ocean Depth 9', 'Minimalist', 140000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic10', 'Cinematic Regal Purple 9', 'Islamic', 150000, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark12', 'Cinematic Winter Frost 5', 'Dark', 130000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal18', 'Cinematic Midnight Gold 4', 'Minimalist', 170000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark13', 'Cinematic Regal Purple 8', 'Dark', 120000, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic11', 'Cinematic Spring Blossom 9', 'Islamic', 160000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral17', 'Cinematic Regal Purple 7', 'Floral', 180000, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark14', 'Cinematic Autumn Rustic 6', 'Dark', 150000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark15', 'Cinematic Ocean Depth 8', 'Dark', 160000, 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral18', 'Cinematic Regal Purple 6', 'Floral', 180000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic12', 'Cinematic Winter Frost 4', 'Islamic', 140000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral19', 'Cinematic Rose Gold 4', 'Floral', 110000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral20', 'Cinematic Autumn Rustic 5', 'Floral', 170000, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal19', 'Cinematic Spring Blossom 8', 'Minimalist', 110000, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral21', 'Cinematic Autumn Rustic 4', 'Floral', 130000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark16', 'Cinematic Rose Gold 3', 'Dark', 170000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic13', 'Cinematic Midnight Gold 3', 'Islamic', 100000, 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic14', 'Cinematic Spring Blossom 7', 'Islamic', 140000, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal20', 'Cinematic Midnight Gold 2', 'Minimalist', 170000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury16', 'Cinematic Forest Mint 6', 'Elegant', 110000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal21', 'Cinematic Spring Blossom 6', 'Minimalist', 130000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal22', 'Cinematic Ocean Depth 7', 'Minimalist', 180000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal23', 'Cinematic Ocean Depth 6', 'Minimalist', 170000, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal24', 'Cinematic Spring Blossom 5', 'Minimalist', 160000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic15', 'Cinematic Regal Purple 5', 'Islamic', 190000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral22', 'Cinematic Winter Frost 3', 'Floral', 180000, 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury17', 'Cinematic Regal Purple 3', 'Elegant', 180000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal25', 'Cinematic Autumn Rustic 3', 'Minimalist', 160000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral23', 'Cinematic Autumn Rustic 2', 'Floral', 170000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral24', 'Cinematic Forest Mint 5', 'Floral', 140000, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark17', 'Cinematic Forest Mint 4', 'Dark', 100000, 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal26', 'Cinematic Rose Gold 2', 'Minimalist', 160000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=300&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury18', 'tema baru', 'Premium', 150000, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=1000&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal27', 'Scandinavian Minimalist', 'Minimalist', 350000, 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury19', 'Cinematic Love Story', 'Premium', 1500000, 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury20', 'Japanese Sakura Garden', 'Premium', 1500000, 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury21', 'Ultra Premium Interactive', 'Premium', 1500000, 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury22', 'Royal Gold Luxury', 'Elegant', 450000, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury23', 'Glassmorphism Elegance', 'Elegant', 399000, 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('rustic01', 'Rustic Vintage', 'Rustic', 299000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('tropical01', 'Ocean Breeze', 'Tropical', 349000, 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('floral25', 'Floral Blossom', 'Floral', 180000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('tropical02', 'Tropical Bali Wedding', 'Tropical', 349000, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('islamic16', 'Islamic Elegant', 'Islamic', 350000, 'https://images.unsplash.com/photo-1585036156171-384164a8c675?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury24', 'Fairytale Castle', 'Premium', 550000, 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('minimal28', 'Monochrome Minimalist', 'Minimalist', 180000, 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury25', 'Realistic Romance', 'Elegant', 350000, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('luxury26', 'Elegant Gold V1', 'Elegant', 150000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('dark18', 'Midnight Glamour', 'Dark', 200000, 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('cinematic-autumn-10', 'Cinematic Autumn 10', 'Elegant', 150000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('cinematic-autumn-11', 'Cinematic Autumn 11', 'Elegant', 150000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('cinematic-theme', 'Cinematic Theme', 'Elegant', 150000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;

INSERT INTO themes (id, name, category, price, thumbnail)
VALUES ('master-theme', 'Master Theme', 'Minimalist', 150000, 'https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=800&auto=format&fit=crop&fm=webp&q=60')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  thumbnail = EXCLUDED.thumbnail;