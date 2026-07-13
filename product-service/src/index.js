const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from the parent root workspace
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[Product Service] ${req.method} ${req.url}`);
  next();
});

// Mock database fallback for instant execution
// const MOCK_CATEGORIES = [
//   { id: 'c1111111-1111-1111-1111-111111111111', name: 'Technology', slug: 'tech' },
//   { id: 'c2222222-2222-2222-2222-222222222222', name: 'Lifestyle', slug: 'lifestyle' },
//   { id: 'c3333333-3333-3333-3333-333333333333', name: 'Clothing', slug: 'clothing' },
//   { id: 'c4444444-4444-4444-4444-444444444444', name: 'Books', slug: 'books' },
//   { id: 'c5555555-5555-5555-5555-555555555555', name: 'Home Decor', slug: 'home' },
//   { id: 'c6666666-6666-6666-6666-666666666666', name: 'Pet Care', slug: 'petcare' }
// ];

// const MOCK_PRODUCTS = [
//   // Tech
//   { id: 'p101', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'AeroPro Wireless Earbuds', description: 'Experience true wireless freedom with active noise cancellation, deep bass, and up to 30 hours of total playtime.', price_in_rupees: 4999.00, image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop', stock: 50 },
//   { id: 'p102', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'Mechanical Ergonomic Keyboard', description: 'Tactile mechanical blue switches, customizable RGB backlit keys, and split layout for comfortable typing.', price_in_rupees: 3499.00, image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop', stock: 30 },
//   { id: 'p103', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'UltraWide 34" Curved Monitor', description: 'Widescreen panoramic display with a 144Hz refresh rate, 1ms response time, and HDR400 for immersive visuals.', price_in_rupees: 28999.00, image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop', stock: 15 },
//   { id: 'p104', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'Quantum 1080p Web Camera', description: 'Full HD video stream at 60fps with built-in stereo dual microphones and autofocus. Ideal for streaming.', price_in_rupees: 2499.00, image_url: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=800&auto=format&fit=crop', stock: 40 },
//   { id: 'p105', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'ProStream USB Microphone', description: 'Cardioid pickup pattern studio-quality condenser microphone with adjustable arm stand and pop filter.', price_in_rupees: 3899.00, image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop', stock: 25 },
//   { id: 'p106', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'Nomad Portable Power Bank', description: 'Ultra-high 20000mAh capacity power bank with 22.5W fast charging, dual USB ports, and USB-C power delivery.', price_in_rupees: 1999.00, image_url: 'https://images.unsplash.com/photo-1609592424089-9a74ec455648?q=80&w=800&auto=format&fit=crop', stock: 100 },
//   { id: 'p107', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'Lumina RGB Smart Desk Lamp', description: 'Smart desk lamp compatible with Alexa & Google Assistant. Adjustable brightness, 16 million colors.', price_in_rupees: 2199.00, image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop', stock: 60 },
//   { id: 'p108', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'Nexus Wireless Charging Pad', description: 'Sleek 15W Qi-certified wireless charging pad with slip-resistant silicone surface.', price_in_rupees: 1299.00, image_url: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?q=80&w=800&auto=format&fit=crop', stock: 80 },
//   { id: 'p109', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'Vanguard Noise Cancelling Headphones', description: 'Premium over-ear headphones with hybrid active noise cancellation, high-resolution audio, and 45h battery.', price_in_rupees: 12499.00, image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', stock: 20 },
//   { id: 'p110', category_id: 'c1111111-1111-1111-1111-111111111111', name: 'Titanium Bluetooth Tracker', description: 'Keep track of keys, bags, and devices with the ultra-slim water-resistant Bluetooth smart tag.', price_in_rupees: 1599.00, image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop', stock: 120 },

//   // Lifestyle
//   { id: 'p201', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'ZenGlow Essential Oil Diffuser', description: 'Ultrasonic mist aromatherapy diffuser with 7-color ambient LED rings, whisper-quiet operation.', price_in_rupees: 1899.00, image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop', stock: 45 },
//   { id: 'p202', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Sleek Stainless Steel Flask', description: 'Double-wall vacuum insulated water bottle keeping drinks ice cold for 24h or hot for 12h.', price_in_rupees: 999.00, image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop', stock: 150 },
//   { id: 'p203', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Polarized Classic Sunglasses', description: 'Retro-style polarized sunglasses offering 100% UV400 protection with durable acetate frame.', price_in_rupees: 1499.00, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop', stock: 75 },
//   { id: 'p204', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Minimalist Leather Cardholder', description: 'Genuine top-grain leather slim cardholder with 4 slots and RFID-blocking central slip pocket.', price_in_rupees: 899.00, image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop', stock: 90 },
//   { id: 'p205', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Serene Yoga Mat & Strap', description: 'Eco-friendly non-slip 6mm TPE yoga mat with dual-sided texture and carry strap.', price_in_rupees: 1799.00, image_url: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=800&auto=format&fit=crop', stock: 40 },
//   { id: 'p206', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Apex Smart Fitness Tracker', description: 'Track steps, sleep cycles, heart rate, and 14 sports modes with built-in GPS.', price_in_rupees: 3999.00, image_url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop', stock: 65 },
//   { id: 'p207', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Aura Travel Neck Pillow', description: 'Ergonomic 100% pure memory foam travel pillow with 360-degree head support.', price_in_rupees: 1199.00, image_url: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?q=80&w=800&auto=format&fit=crop', stock: 110 },
//   { id: 'p208', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Urban Canvas Backpack', description: 'Water-resistant vintage canvas backpack with laptop sleeve and leather details.', price_in_rupees: 2799.00, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', stock: 35 },
//   { id: 'p209', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Gourmet Cold Brew Maker', description: '1.5L borosilicate glass cold brew coffee maker with fine mesh stainless steel filter.', price_in_rupees: 1599.00, image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop', stock: 50 },
//   { id: 'p210', category_id: 'c2222222-2222-2222-2222-222222222222', name: 'Bamboo Bento Lunch Box', description: 'Eco-friendly double-tier bento box made with natural bamboo fibers and leakproof seals.', price_in_rupees: 1299.00, image_url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop', stock: 85 },

//   // Clothing
//   { id: 'p301', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'Signature Unisex Cotton Hoodie', description: 'Heavyweight pre-shrunk French terry cotton hoodie with cozy fleece backing.', price_in_rupees: 2499.00, image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop', stock: 70 },
//   { id: 'p302', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'Classic Linen Button-Down', description: 'Breathable ultra-soft 100% premium linen shirt. Relaxed fit design ideal for summer.', price_in_rupees: 1899.00, image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop', stock: 55 },
//   { id: 'p303', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'ActiveFit Breathable Joggers', description: 'Lightweight 4-way stretch performance joggers with secure zip utility pockets.', price_in_rupees: 1599.00, image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop', stock: 80 },
//   { id: 'p304', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'Cozy Merino Wool Socks', description: 'Three pack of thermal cushioning crew socks made from high-grade moisture-absorbing merino wool.', price_in_rupees: 799.00, image_url: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=800&auto=format&fit=crop', stock: 120 },
//   { id: 'p305', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'Urban Denim Trucker Jacket', description: 'Heavyweight durable raw indigo wash denim jacket with button flaps.', price_in_rupees: 2999.00, image_url: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=800&auto=format&fit=crop', stock: 30 },
//   { id: 'p306', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'Everyday Pima Crewneck Tee', description: 'Luxurious Peruvian Pima cotton basic t-shirt with a modern tailored cut. Pack of 2.', price_in_rupees: 999.00, image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop', stock: 150 },
//   { id: 'p307', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'FlexFit Performance Shorts', description: 'Waterproof fast-drying athletic shorts with supportive mesh liner.', price_in_rupees: 1199.00, image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop', stock: 95 },
//   { id: 'p308', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'Suede Slip-On Loafers', description: 'Premium genuine suede loafers with cushioned memory foam insoles.', price_in_rupees: 3499.00, image_url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop', stock: 25 },
//   { id: 'p309', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'Thermal Knit Long Sleeve', description: 'Classic waffle-weave thermal crewneck sweater for breathable insulation.', price_in_rupees: 1399.00, image_url: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800&auto=format&fit=crop', stock: 60 },
//   { id: 'p310', category_id: 'c3333333-3333-3333-3333-333333333333', name: 'Windproof Packable Rain Shell', description: 'Ultra-light windbreaker shell with fully taped seams and adjustable storm hood.', price_in_rupees: 2199.00, image_url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop', stock: 45 },

//   // Books
//   { id: 'p401', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'Designing the Digital Future', description: 'A comprehensive study of UI/UX trends, containing insights from professionals at Apple, Google, and Meta.', price_in_rupees: 899.00, image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop', stock: 80 },
//   { id: 'p402', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'The Art of Slow Living', description: 'A gorgeous photography and essay book outlining principles of minimalism and peaceful design.', price_in_rupees: 1299.00, image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop', stock: 40 },
//   { id: 'p403', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'Cooking with Fire & Spice', description: 'Over 100 vibrant international recipes detailing the science of spices and live open fire culinary styles.', price_in_rupees: 999.00, image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop', stock: 60 },
//   { id: 'p404', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'Whispers of the Horizon', description: 'An award-winning futuristic science fiction novel exploring humanity''s first journey to a twin star solar system.', price_in_rupees: 499.00, image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop', stock: 100 },
//   { id: 'p405', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'Mindset & Mastery', description: 'A guide to breaking habits, refining discipline, and training mental resilience for peak executive performance.', price_in_rupees: 599.00, image_url: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop', stock: 110 },
//   { id: 'p406', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'A History of Lost Civilizations', description: 'Deep archeological research into forgotten kingdoms, from Bronze Age empires to Mesoamerican ruins.', price_in_rupees: 799.00, image_url: 'https://images.unsplash.com/photo-1463320305666-373852223a35?q=80&w=800&auto=format&fit=crop', stock: 50 },
//   { id: 'p407', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'Creative Thinking Workbook', description: 'An interactive workbook filled with daily mental prompts, drawing challenges, and cognitive exercises.', price_in_rupees: 450.00, image_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=800&auto=format&fit=crop', stock: 130 },
//   { id: 'p408', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'The Cosmic Ocean: Astronomy', description: 'Stunning photographic companion guide to stars, nebulae, black holes, and the physics of the universe.', price_in_rupees: 1499.00, image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', stock: 35 },
//   { id: 'p409', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'Gardening for Beginners', description: 'Practical guides on soil pH, organic composting, herb boxes, and growing seasonal veggies in compact balconies.', price_in_rupees: 699.00, image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop', stock: 70 },
//   { id: 'p410', category_id: 'c4444444-4444-4444-4444-444444444444', name: 'The Path of the Code', description: 'A collection of essays and inspiring memoirs from pioneer software engineers, cataloging the evolution of web tech.', price_in_rupees: 799.00, image_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop', stock: 90 },

//   // Home Decor
//   { id: 'p501', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Premium Down-Alternative Pillow', description: 'Hypoallergenic luxurious gel-fiber bed pillows designed for side, back, and stomach sleepers. Set of 2.', price_in_rupees: 1699.00, image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?q=80&w=800&auto=format&fit=crop', stock: 50 },
//   { id: 'p502', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Aromatic Soy Candle Set', description: 'Hand-poured natural soy wax candles infused with lavender, sandalwood, and sweet citrus essential oils.', price_in_rupees: 899.00, image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop', stock: 110 },
//   { id: 'p503', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Non-Stick Ceramic Fry Pan', description: 'Eco-friendly 10-inch skillet with hard-anodized aluminum and mineral-based non-toxic ceramic coating.', price_in_rupees: 2299.00, image_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop', stock: 45 },
//   { id: 'p504', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Magnetic Wooden Knife Block', description: 'Sleek double-sided acacia wood magnetic stand to organize high-carbon kitchen cutlery safely.', price_in_rupees: 1999.00, image_url: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=800&auto=format&fit=crop', stock: 35 },
//   { id: 'p505', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Turkish Cotton Bath Towels', description: 'Woven from 100% genuine ringspun Turkish cotton. Extra plush, quick-drying absorbent towels.', price_in_rupees: 2499.00, image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=800&auto=format&fit=crop', stock: 60 },
//   { id: 'p506', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Boho Woven Storage Baskets', description: 'Multi-functional cotton rope baskets with handle detailing. Perfect for toys, blankets, or laundry.', price_in_rupees: 1499.00, image_url: 'https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=800&auto=format&fit=crop', stock: 75 },
//   { id: 'p507', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Smart Wi-Fi Air Purifier', description: 'True HEPA air filter capturing 99.97% of smoke, pet dander, and odors with companion phone app.', price_in_rupees: 5999.00, image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?q=80&w=800&auto=format&fit=crop', stock: 25 },
//   { id: 'p508', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Insulated Blackout Curtains', description: 'Thermal triple-weave window drapes. Blocks 95% light and insulates against winter cold/summer heat.', price_in_rupees: 1599.00, image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop', stock: 80 },
//   { id: 'p509', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Memory Foam Seat Cushion', description: 'Ergonomic tailbone relief coccyx support pillow for office chairs or long drives. Breathable cover.', price_in_rupees: 1299.00, image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop', stock: 95 },
//   { id: 'p510', category_id: 'c5555555-5555-5555-5555-555555555555', name: 'Ceramic Mug - Speckled Sand', description: 'Handcrafted ceramic stoneware coffee mug featuring a warm speckled glaze and large comfort handle.', price_in_rupees: 699.00, image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop', stock: 120 },

//   // Pet Care
//   { id: 'p601', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Orthopedic Dog Bed', description: 'Premium memory foam pet bed with a removable machine-washable plush cover and waterproof inner liner.', price_in_rupees: 3899.00, image_url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=800&auto=format&fit=crop', stock: 30 },
//   { id: 'p602', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Interactive Laser Toy for Cats', description: 'Automatic rotating laser toy with 3 speed modes and 15-minute auto-timer. Stimulates natural instincts.', price_in_rupees: 1299.00, image_url: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop', stock: 80 },
//   { id: 'p603', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Grain-Free Salmon Dog Treats', description: 'Made with fresh wild-caught salmon and sweet potato. Rich in Omega-3 and Omega-6 fatty acids.', price_in_rupees: 699.00, image_url: 'https://images.unsplash.com/photo-1608454367599-c113d9692484?q=80&w=800&auto=format&fit=crop', stock: 150 },
//   { id: 'p604', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Retractable Hands-Free Dog Leash', description: 'Durable nylon tape leash with strong metal buckle, dual bungee design, and built-in waist belt for running.', price_in_rupees: 1499.00, image_url: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=800&auto=format&fit=crop', stock: 70 },
//   { id: 'p605', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Self-Cleaning Pet Grooming Brush', description: 'Gently removes loose hair, tangles, and dander. Features one-click retractable bristles for fast cleaning.', price_in_rupees: 899.00, image_url: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop', stock: 90 },
//   { id: 'p606', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Slow Feeder Anti-Gulping Bowl', description: 'Eco-friendly food-grade maze bowl designed to extend eating times and prevent bloating or indigestion.', price_in_rupees: 799.00, image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop', stock: 110 },
//   { id: 'p607', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Cat Scratching Post - Sisal', description: 'Sturdy vertical post wrapped in natural sisal ropes with a dangling play ball to save your sofas.', price_in_rupees: 1599.00, image_url: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?q=80&w=800&auto=format&fit=crop', stock: 50 },
//   { id: 'p608', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Travel Pet Water Dispenser', description: 'Leak-proof food-grade plastic travel bottle with drawer water trough and built-in carbon water filter.', price_in_rupees: 999.00, image_url: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=800&auto=format&fit=crop', stock: 100 },
//   { id: 'p609', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Ultra-Absorbent Pet Towel', description: 'Microfiber fast-drying pet bath towel. Holds up to 7x its weight in water, with hand pockets for grip.', price_in_rupees: 599.00, image_url: 'https://images.unsplash.com/photo-1581888227599-779811939961?q=80&w=800&auto=format&fit=crop', stock: 130 },
//   { id: 'p610', category_id: 'c6666666-6666-6666-6666-666666666666', name: 'Cozy Pet Carrier Bag', description: 'Airline-approved soft-sided pet carrier with mesh windows, safety interior leash, and fleece bed.', price_in_rupees: 2499.00, image_url: 'https://images.unsplash.com/photo-1513360309081-36f5e878499d?q=80&w=800&auto=format&fit=crop', stock: 40 }
// ];

// Initialize Supabase Client if env is set
let supabase = null;
const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY;

if (useSupabase) {
  console.log('[Product Service] Supabase credentials detected. Connecting to DB...');
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
} else {
  console.log('[Product Service] No Supabase credentials detected. Running in Mock Data mode.');
}

// 1. Get Categories
app.get('/api/products/categories', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return res.json(data);
    } else {
      return res.json(MOCK_CATEGORIES);
    }
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// 2. Get Products (with Search & Category Filters)
app.get('/api/products', async (req, res) => {
  const { category, search } = req.query;
  try {
    if (useSupabase) {
      let query = supabase.from('products').select('*');
      
      if (category) {
        // First find the category ID by slug
        const { data: catData, error: catErr } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', category)
          .single();
          
        if (catData) {
          query = query.eq('category_id', catData.id);
        } else if (catErr) {
          console.warn(`Category slug "${category}" not found in DB`);
        }
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.json(data);
    } else {
      let filtered = [...MOCK_PRODUCTS];

      if (category) {
        const foundCat = MOCK_CATEGORIES.find(c => c.slug === category);
        if (foundCat) {
          filtered = filtered.filter(p => p.category_id === foundCat.id);
        }
      }

      if (search) {
        const queryStr = search.toLowerCase();
        filtered = filtered.filter(
          p => p.name.toLowerCase().includes(queryStr) || 
               p.description.toLowerCase().includes(queryStr)
        );
      }

      return res.json(filtered);
    }
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// 3. Get Product Details
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(data);
    } else {
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      // Attach category info
      const cat = MOCK_CATEGORIES.find(c => c.id === product.category_id);
      return res.json({
        ...product,
        categories: cat ? { name: cat.name, slug: cat.slug } : null
      });
    }
  } catch (error) {
    console.error('Error fetching product details:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ service: 'product-service', status: 'healthy', database: useSupabase ? 'supabase' : 'mock' });
});

app.listen(PORT, () => {
  console.log(`[Product Service] Running on port ${PORT}`);
});
