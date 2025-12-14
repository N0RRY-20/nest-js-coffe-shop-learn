import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body()
    body: {
      customerName: string;
      items: { productId: number; quantity: number }[];
    },
  ) {
    return this.ordersService.createOrder(body);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
}
