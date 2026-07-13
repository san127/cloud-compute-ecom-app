const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from parent root workspace
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[Order Service] ${req.method} ${req.url}`);
  next();
});

// Mock database in-memory cache
const MOCK_ORDERS = [];

// Initialize Supabase Client if env is set
let supabase = null;
const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY;

if (useSupabase) {
  console.log('[Order Service] Supabase credentials detected. Connecting to DB...');
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
} else {
  console.log('[Order Service] No Supabase credentials detected. Running in Mock Data mode.');
}

// 1. Create a new order (Checkout process)
app.post('/api/orders', async (req, res) => {
  const { customerName, customerEmail, cartItems, totalAmount } = req.body;

  if (!customerName || !customerEmail || !cartItems || !cartItems.length || !totalAmount) {
    return res.status(400).json({ error: 'Missing required checkout information.' });
  }

  try {
    if (useSupabase) {
      // 1. Insert order record
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          customer_email: customerEmail,
          total_amount: totalAmount,
          status: 'Paid'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderId = orderData.id;

      // 2. Insert order items
      const itemsToInsert = cartItems.map(item => ({
        order_id: orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) {
        // Simple rollback attempt (delete order if items fail)
        await supabase.from('orders').delete().eq('id', orderId);
        throw itemsError;
      }

      // 3. Subtract stock for each product (simple update, trigger or inline loop)
      for (const item of cartItems) {
        // Fetch current stock
        const { data: prod } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .single();

        if (prod) {
          const newStock = Math.max(0, prod.stock - item.quantity);
          await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.productId);
        }
      }

      console.log(`[Order Service] Order created in DB: ${orderId}`);
      return res.status(201).json({
        success: true,
        orderId: orderId,
        message: 'Order placed successfully via Supabase Database.'
      });

    } else {
      // Mock flow
      const mockOrderId = 'ord-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
      const newOrder = {
        id: mockOrderId,
        customer_name: customerName,
        customer_email: customerEmail,
        total_amount: totalAmount,
        status: 'Paid',
        created_at: new Date().toISOString(),
        items: cartItems
      };

      MOCK_ORDERS.push(newOrder);
      console.log(`[Order Service] Order saved in Memory: ${mockOrderId}`);

      return res.status(201).json({
        success: true,
        orderId: mockOrderId,
        message: 'Order simulated successfully (Mock Mode).'
      });
    }
  } catch (error) {
    console.error('Error during checkout processing:', error.message);
    res.status(500).json({ error: 'Checkout failed. Please check backend configuration.', details: error.message });
  }
});

// 2. Get Order Details
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (useSupabase) {
      // Get order info
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderErr) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Get order items
      const { data: items, error: itemsErr } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          price,
          product_id,
          products (
            name,
            image_url
          )
        `)
        .eq('order_id', id);

      if (itemsErr) throw itemsErr;

      return res.json({
        ...order,
        items: items.map(i => ({
          productId: i.product_id,
          name: i.products ? i.products.name : 'Unknown Product',
          imageUrl: i.products ? i.products.image_url : '',
          quantity: i.quantity,
          price: i.price
        }))
      });
    } else {
      const order = MOCK_ORDERS.find(o => o.id === id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.json(order);
    }
  } catch (error) {
    console.error('Error fetching order details:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ service: 'order-service', status: 'healthy', database: useSupabase ? 'supabase' : 'mock' });
});

app.listen(PORT, () => {
  console.log(`[Order Service] Running on port ${PORT}`);
});
