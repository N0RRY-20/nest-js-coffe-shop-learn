import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  category: text('category').default('coffee'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ... (kode products di atas biarkan saja)

// 1. Tabel Header Transaksi
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').default('Pelanggan'), // Nama pembeli
  totalAmount: integer('total_amount').default(0), // Total harga belanjaan
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Tabel Detail Item (Relasi)
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id), // Konek ke tabel orders
  productId: integer('product_id').references(() => products.id), // Konek ke tabel products
  quantity: integer('quantity').notNull(), // Jumlah beli (misal: 2 cup)
  price: integer('price').notNull(), // Harga saat beli (PENTING: disimpan supaya kalau harga kopi naik, riwayat transaksi lama gak berubah)
});
