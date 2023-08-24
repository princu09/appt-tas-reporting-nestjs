import { Controller, Post, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('/webhook')
  stripeWebook(@Req() req: Request) {
    return this.stripeService.stripeWebhook(req);
  }
}
