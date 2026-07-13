# Goods4you: Premium Liquid Glass E-Commerce (Local Startup Guide)

Goods4you is a modern, microservices-based e-commerce system. It features a premium **Liquid Glass (glassmorphism)** user interface styled with custom particle click sparks, wizard progress checkouts, and clean dark-mode radial gradients.

---

## Technical Stack & Architecture

- **Frontend**: React (Vite) styled with Vanilla CSS (translucent blurs, neon gradients, animations).
- **Product Catalog Service**: Node Express API (Port `5001`) fetching categories, items, and conducting searches.
- **Order Service**: Node Express API (Port `5002`) submitting orders and managing inventory.
- **Database**: Supabase (Postgres) holding relational catalogs and transactions.

---

## Local Setup (Running without Docker)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (installed automatically with Node.js)

### 1. Database Setup (Supabase)
To establish your cloud database:
1. Go to your [Supabase Dashboard](https://supabase.com/) and create a new project.
2. Navigate to the **SQL Editor** tab in the sidebar.
3. Copy the contents of the [database/schema.sql](file:///c:/Users/Apple/Desktop/cloud%20computing/antigravity%20projs/database/schema.sql) file and paste it into the editor window.
4. Click **Run** to execute. This creates the tables (`categories`, `products`, `orders`, `order_items`), sets up database performance indexes, and seeds **60 products** (10 per category).

### 2. Configure Environment Variables
Locate the `.env` file in the project root directory. Enter your Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
```

*Note: If these credentials are left blank, both microservices will automatically run in **Mock Data Mode**, saving orders to a local memory cache so you can test the checkout flow immediately without setting up a database.*

### 3. Install All Dependencies
Open a terminal in the project root folder (`antigravity projs/`) and run the custom recursive installation script:

```bash
npm run install-all
```

This command automatically runs `npm install` inside the root workspace, `./frontend`, `./product-service`, and `./order-service` folders.

### 4. Start the Application Stack
To launch all services concurrently, execute this command from the project root folder:

```bash
npm run dev
```

This single command starts:
- **Product catalog microservice** on port `5001`
- **Order creation microservice** on port `5002`
- **React frontend development server** on port `5173` (with hot module replacement)

Go to [http://localhost:5173](http://localhost:5173) in your browser to experience Goods4you.

---

## API Documentation

### Product Service (`5001`)
- `GET /api/products/categories`: Fetch categories list.
- `GET /api/products`: Retrieve catalog products. Supports:
  - `?category=slug` (e.g. `tech`, `lifestyle`, `clothing`, `books`, `home`, `petcare`)
  - `?search=keyword` (query matches name and description using case-insensitive search)
- `GET /api/products/:id`: Retrieve single product card details.
- `GET /health`: Health status.

### Order Service (`5002`)
- `POST /api/orders`: Submit cart checkout items.
- `GET /api/orders/:id`: Query details for a placed order receipt.
- `GET /health`: Health status.
