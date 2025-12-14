import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from 'src/database/database.module';
import * as schema from 'src/database/schema';

@Injectable()
export class ProductsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async findAll() {
    return await this.db.select().from(schema.products);
  }

  async create(data: { name: string; price: number; description: string }) {
    return await this.db.insert(schema.products).values(data).returning();
  }
}
