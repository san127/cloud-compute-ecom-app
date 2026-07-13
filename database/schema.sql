-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price_in_rupees NUMERIC(12, 2) NOT NULL CHECK (price_in_rupees >= 0),
    image_url TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Clean up any existing data if re-running
TRUNCATE order_items, orders, products, categories CASCADE;

-- Insert categories and save UUIDs
INSERT INTO categories (id, name, slug) VALUES
('c1111111-1111-1111-1111-111111111111', 'Technology', 'tech'),
('c2222222-2222-2222-2222-222222222222', 'Lifestyle', 'lifestyle'),
('c3333333-3333-3333-3333-333333333333', 'Clothing', 'clothing'),
('c4444444-4444-4444-4444-444444444444', 'Books', 'books'),
('c5555555-5555-5555-5555-555555555555', 'Home Decor', 'home'),
('c6666666-6666-6666-6666-666666666666', 'Pet Care', 'petcare');

-- Insert products for Tech category (10 items)
INSERT INTO products (category_id, name, description, price_in_rupees, image_url, stock) VALUES
('c1111111-1111-1111-1111-111111111111', 'AeroPro Wireless Earbuds', 'Experience true wireless freedom with active noise cancellation, deep bass, and up to 30 hours of total playtime with the smart charging case.', 4999.00, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop', 50),
('c1111111-1111-1111-1111-111111111111', 'Mechanical Ergonomic Keyboard', 'Tactile mechanical blue switches, customizable RGB backlit keys, and an ergonomic split layout for comfortable typing during long coding sessions.', 3499.00, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop', 30),
('c1111111-1111-1111-1111-111111111111', 'UltraWide 34" Curved Monitor', 'Widescreen panoramic display with a 144Hz refresh rate, 1ms response time, and HDR400 for stunning, immersive visuals.', 28999.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop', 15),
('c1111111-1111-1111-1111-111111111111', 'Quantum 1080p Web Camera', 'Full HD video stream at 60fps with built-in stereo dual microphones and autofocus. Ideal for remote work and streaming.', 2499.00, 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=800&auto=format&fit=crop', 40),
('c1111111-1111-1111-1111-111111111111', 'ProStream USB Microphone', 'Cardioid pickup pattern studio-quality condenser microphone with adjustable arm stand, shock mount, and pop filter.', 3899.00, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop', 25),
('c1111111-1111-1111-1111-111111111111', 'Nomad Portable Power Bank', 'Ultra-high 20000mAh capacity power bank with 22.5W fast charging, dual USB ports, and USB-C power delivery.', 1999.00, 'https://images.unsplash.com/photo-1609592424089-9a74ec455648?q=80&w=800&auto=format&fit=crop', 100),
('c1111111-1111-1111-1111-111111111111', 'Lumina RGB Smart Desk Lamp', 'Smart desk lamp compatible with Alexa & Google Assistant. Adjustable brightness, 16 million colors, and scheduling app.', 2199.00, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop', 60),
('c1111111-1111-1111-1111-111111111111', 'Nexus Wireless Charging Pad', 'Sleek 15W Qi-certified wireless charging pad with slip-resistant silicone surface and temperature control safeguards.', 1299.00, 'https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=800&auto=format&fit=crop', 80),
('c1111111-1111-1111-1111-111111111111', 'Vanguard Noise Cancelling Headphones', 'Premium over-ear headphones with hybrid active noise cancellation, high-resolution audio, and 45-hour battery life.', 12499.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', 20),
('c1111111-1111-1111-1111-111111111111', 'Titanium Bluetooth Tracker', 'Keep track of keys, bags, and devices with the ultra-slim water-resistant Bluetooth smart tag and companion finder app.', 1599.00, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop', 120);

-- Insert products for Lifestyle category (10 items)
INSERT INTO products (category_id, name, description, price_in_rupees, image_url, stock) VALUES
('c2222222-2222-2222-2222-222222222222', 'ZenGlow Essential Oil Diffuser', 'Ultrasonic mist aromatherapy diffuser with 7-color ambient LED rings, whisper-quiet operation, and auto-shutoff.', 1899.00, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop', 45),
('c2222222-2222-2222-2222-222222222222', 'Sleek Stainless Steel Flask', 'Double-wall vacuum insulated water bottle keeping drinks ice cold for 24 hours or steaming hot for 12 hours.', 999.00, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop', 150),
('c2222222-2222-2222-2222-222222222222', 'Polarized Classic Sunglasses', 'Retro-style polarized sunglasses offering 100% UV400 protection with a lightweight durable acetate frame.', 1499.00, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', 75),
('c2222222-2222-2222-2222-222222222222', 'Minimalist Leather Cardholder', 'Genuine top-grain leather slim cardholder with 4 slots and RFID-blocking central slip pocket.', 899.00, 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop', 90),
('c2222222-2222-2222-2222-222222222222', 'Serene Yoga Mat & Strap', 'Eco-friendly non-slip 6mm TPE yoga mat with dual-sided texture and adjustable carry strap.', 1799.00, 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=800&auto=format&fit=crop', 40),
('c2222222-2222-2222-2222-222222222222', 'Apex Smart Fitness Tracker', 'Track steps, sleep cycles, heart rate, and 14 different sports modes with built-in GPS and smart notifications.', 3999.00, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop', 65),
('c2222222-2222-2222-2222-222222222222', 'Aura Travel Neck Pillow', 'Ergonomic 100% pure memory foam travel pillow with a magnetic clasp and 360-degree head support.', 1199.00, 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?q=80&w=800&auto=format&fit=crop', 110),
('c2222222-2222-2222-2222-222222222222', 'Urban Canvas Backpack', 'Water-resistant vintage canvas backpack with laptop sleeve, leather details, and multiple organized utility pockets.', 2799.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', 35),
('c2222222-2222-2222-2222-222222222222', 'Gourmet Cold Brew Maker', '1.5L borosilicate glass cold brew coffee maker with fine mesh stainless steel filter and airtight cap.', 1599.00, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop', 50),
('c2222222-2222-2222-2222-222222222222', 'Bamboo Bento Lunch Box', 'Eco-friendly double-tier bento box made with natural bamboo fibers, leakproof silicone seals, and dynamic dividers.', 1299.00, 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop', 85);

-- Insert products for Clothing category (10 items)
INSERT INTO products (category_id, name, description, price_in_rupees, image_url, stock) VALUES
('c3333333-3333-3333-3333-333333333333', 'Signature Unisex Cotton Hoodie', 'Heavyweight pre-shrunk French terry cotton hoodie with fleece backing, kangaroo pocket, and ribbed cuffs.', 2499.00, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop', 70),
('c3333333-3333-3333-3333-333333333333', 'Classic Linen Button-Down', 'Breathable ultra-soft 100% premium linen shirt. Relaxed fit design ideal for summer wear.', 1899.00, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', 55),
('c3333333-3333-3333-3333-333333333333', 'ActiveFit Breathable Joggers', 'Lightweight 4-way stretch performance joggers. Features secure zip pockets and moisture-wicking technology.', 1599.00, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop', 80),
('c3333333-3333-3333-3333-333333333333', 'Cozy Merino Wool Socks', 'Three pack of thermal cushioning crew socks made from high-grade moisture-absorbing merino wool.', 799.00, 'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=800&auto=format&fit=crop', 120),
('c3333333-3333-3333-3333-333333333333', 'Urban Denim Trucker Jacket', 'Heavyweight durable raw indigo wash denim jacket with button flaps and adjustable hem buttons.', 2999.00, 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=800&auto=format&fit=crop', 30),
('c3333333-3333-3333-3333-333333333333', 'Everyday Pima Crewneck Tee', 'Luxurious Peruvian Pima cotton basic t-shirt with a modern tailored cut. Pack of 2.', 999.00, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', 150),
('c3333333-3333-3333-3333-333333333333', 'FlexFit Performance Shorts', 'Waterproof fast-drying athletic shorts with supportive mesh liner and zipped back card pocket.', 1199.00, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop', 95),
('c3333333-3333-3333-3333-333333333333', 'Suede Slip-On Loafers', 'Premium genuine suede loafers with cushioned memory foam insoles and slip-resistant rubber soles.', 3499.00, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop', 25),
('c3333333-3333-3333-3333-333333333333', 'Thermal Knit Long Sleeve', 'Classic waffle-weave thermal crewneck sweater for breathable insulation on crisp chilly days.', 1399.00, 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800&auto=format&fit=crop', 60),
('c3333333-3333-3333-3333-333333333333', 'Windproof Packable Rain Shell', 'Ultra-light windbreaker shell with fully taped seams and adjustable storm hood. Packs small.', 2199.00, 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop', 45);

-- Insert products for Books category (10 items)
INSERT INTO products (category_id, name, description, price_in_rupees, image_url, stock) VALUES
('c4444444-4444-4444-4444-444444444444', 'Designing the Digital Future', 'A comprehensive study of UI/UX trends, containing insights from design professionals at Apple, Google, and Meta.', 899.00, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop', 80),
('c4444444-4444-4444-4444-444444444444', 'The Art of Slow Living', 'A gorgeous photography and essay book outlining principles of minimalism, interior mindfulness, and peaceful design.', 1299.00, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop', 40),
('c4444444-4444-4444-4444-444444444444', 'Cooking with Fire & Spice', 'Over 100 vibrant international recipes detailing the science of spices and live open fire culinary styles.', 999.00, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop', 60),
('c4444444-4444-4444-4444-444444444444', 'Whispers of the Horizon', 'An award-winning futuristic science fiction novel exploring humanity''s first journey to a twin star solar system.', 499.00, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop', 100),
('c4444444-4444-4444-4444-444444444444', 'Mindset & Mastery', 'A guide to breaking habits, refining discipline, and training mental resilience for peak executive performance.', 599.00, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop', 110),
('c4444444-4444-4444-4444-444444444444', 'A History of Lost Civilizations', 'Deep archeological research into forgotten kingdoms, from Bronze Age empires to Mesoamerican ruins.', 799.00, 'https://images.unsplash.com/photo-1463320305666-373852223a35?q=80&w=800&auto=format&fit=crop', 50),
('c4444444-4444-4444-4444-444444444444', 'Creative Thinking Workbook', 'An interactive workbook filled with daily mental prompts, drawing challenges, and cognitive lateral thinking exercises.', 450.00, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=800&auto=format&fit=crop', 130),
('c4444444-4444-4444-4444-444444444444', 'The Cosmic Ocean: Astronomy Guide', 'Stunning photographic companion guide to stars, nebulae, black holes, and the current physics of universe expansion.', 1499.00, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', 35),
('c4444444-4444-4444-4444-444444444444', 'Gardening for Beginners', 'Practical guides on soil pH, organic composting, herb boxes, and growing seasonal veggies in compact balconies.', 699.00, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop', 70),
('c4444444-4444-4444-4444-444444444444', 'The Path of the Code', 'A collection of essays and inspiring memoirs from pioneer software engineers, cataloging the evolution of web tech.', 799.00, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop', 90);

-- Insert products for Home Decor category (10 items)
INSERT INTO products (category_id, name, description, price_in_rupees, image_url, stock) VALUES
('c5555555-5555-5555-5555-555555555555', 'Premium Down-Alternative Pillow', 'Hypoallergenic luxurious gel-fiber bed pillows designed for side, back, and stomach sleepers. Set of 2.', 1699.00, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=800&auto=format&fit=crop', 50),
('c5555555-5555-5555-5555-555555555555', 'Aromatic Soy Candle Set', 'Hand-poured natural soy wax candles infused with lavender, sandalwood, and sweet citrus essential oils.', 899.00, 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop', 110),
('c5555555-5555-5555-5555-555555555555', 'Non-Stick Ceramic Fry Pan', 'Eco-friendly 10-inch skillet with hard-anodized aluminum and mineral-based non-toxic ceramic coating.', 2299.00, 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop', 45),
('c5555555-5555-5555-5555-555555555555', 'Magnetic Wooden Knife Block', 'Sleek double-sided acacia wood magnetic stand to organize high-carbon kitchen cutlery safely.', 1999.00, 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=800&auto=format&fit=crop', 35),
('c5555555-5555-5555-5555-555555555555', 'Turkish Cotton Bath Towels', 'Woven from 100% genuine ringspun Turkish cotton. Extra plush, quick-drying absorbent towels.', 2499.00, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=800&auto=format&fit=crop', 60),
('c5555555-5555-5555-5555-555555555555', 'Boho Woven Storage Baskets', 'Multi-functional cotton rope baskets with handle detailing. Perfect for toys, blankets, or laundry.', 1499.00, 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=800&auto=format&fit=crop', 75),
('c5555555-5555-5555-5555-555555555555', 'Smart Wi-Fi Air Purifier', 'True HEPA air filter capturing 99.97% of smoke, pet dander, and odors with companion phone app.', 5999.00, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop', 25),
('c5555555-5555-5555-5555-555555555555', 'Insulated Blackout Curtains', 'Thermal triple-weave window drapes. Blocks 95% light and insulates against winter cold/summer heat.', 1599.00, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', 80),
('c5555555-5555-5555-5555-555555555555', 'Memory Foam Seat Cushion', 'Ergonomic tailbone relief coccyx support pillow for office chairs or long drives. Breathable cover.', 1299.00, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop', 95),
('c5555555-5555-5555-5555-555555555555', 'Ceramic Mug - Speckled Sand', 'Handcrafted ceramic stoneware coffee mug featuring a warm speckled glaze and large comfort handle.', 699.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop', 120);

-- Insert products for Pet Care category (10 items)
INSERT INTO products (category_id, name, description, price_in_rupees, image_url, stock) VALUES
('c6666666-6666-6666-6666-666666666666', 'Orthopedic Dog Bed', 'Premium memory foam pet bed with a removable machine-washable plush cover and waterproof inner liner.', 3899.00, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=800&auto=format&fit=crop', 30),
('c6666666-6666-6666-6666-666666666666', 'Interactive Laser Toy for Cats', 'Automatic rotating laser toy with 3 speed modes and 15-minute auto-timer. Stimulates natural instincts.', 1299.00, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop', 80),
('c6666666-6666-6666-6666-666666666666', 'Grain-Free Salmon Dog Treats', 'Made with fresh wild-caught salmon and sweet potato. Rich in Omega-3 and Omega-6 fatty acids.', 699.00, 'https://images.unsplash.com/photo-1608454367599-c113d9692484?q=80&w=800&auto=format&fit=crop', 150),
('c6666666-6666-6666-6666-666666666666', 'Retractable Hands-Free Dog Leash', 'Durable nylon tape leash with strong metal buckle, dual bungee design, and built-in waist belt for running.', 1499.00, 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=800&auto=format&fit=crop', 70),
('c6666666-6666-6666-6666-666666666666', 'Self-Cleaning Pet Grooming Brush', 'Gently removes loose hair, tangles, and dander. Features one-click retractable bristles for fast cleaning.', 899.00, 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop', 90),
('c6666666-6666-6666-6666-666666666666', 'Slow Feeder Anti-Gulping Bowl', 'Eco-friendly food-grade maze bowl designed to extend eating times and prevent bloating or indigestion.', 799.00, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop', 110),
('c6666666-6666-6666-6666-666666666666', 'Cat Scratching Post - Sisal', 'Sturdy vertical post wrapped in natural sisal ropes with a dangling play ball to save your sofas.', 1599.00, 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?q=80&w=800&auto=format&fit=crop', 50),
('c6666666-6666-6666-6666-666666666666', 'Travel Pet Water Dispenser', 'Leak-proof food-grade plastic travel bottle with drawer water trough and built-in carbon water filter.', 999.00, 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=800&auto=format&fit=crop', 100),
('c6666666-6666-6666-6666-666666666666', 'Ultra-Absorbent Pet Towel', 'Microfiber fast-drying pet bath towel. Holds up to 7x its weight in water, with hand pockets for grip.', 599.00, 'https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=800&auto=format&fit=crop', 130),
('c6666666-6666-6666-6666-666666666666', 'Cozy Pet Carrier Bag', 'Airline-approved soft-sided pet carrier with mesh windows, safety interior leash, and fleece bed.', 2499.00, 'https://images.unsplash.com/photo-1513360309081-36f5e878499d?q=80&w=800&auto=format&fit=crop', 40);
