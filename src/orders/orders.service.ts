import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/database/database.module';
import * as schema from 'src/database/schema';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    return await this.db.select().from(schema.orders);
  }

  async createOrder(data: {
    customerName: string;
    items: { productId: number; quantity: number }[];
  }) {
    return await this.db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(schema.orders)
        .values({
          customerName: data.customerName,
          totalAmount: 0,
        })
        .returning();
      let calculatedTotal = 0;

      for (const item of data.items) {
        const [product] = await tx
          .select()
          .from(schema.products)
          .where(eq(schema.products.id, item.productId));

        if (!product) continue;

        const subTotal = product.price * item.quantity;

        calculatedTotal += subTotal;

        await tx.insert(schema.orderItems).values({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }
      await tx
        .update(schema.orders)
        .set({ totalAmount: calculatedTotal })
        .where(eq(schema.orders.id, newOrder.id));

      return {
        orderId: newOrder.id,
        status: 'Success',
        total: calculatedTotal,
      };
    });
  }
}
