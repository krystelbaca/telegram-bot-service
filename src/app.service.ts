import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import axios from 'axios';

@Injectable()
export class AppService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_API_KEY);

    this.bot.start((ctx) =>
      ctx.reply(
        'Welcome to ChooseCheap Bot! Use /search <product> to compare prices and /subscribe <product> <price> to get notified when the price drops.',
      ),
    );
    this.bot.command('search', (ctx) => this.handleSearch(ctx));

    this.bot.launch();
  }

  private async handleSearch(ctx: any) {
    const productName = ctx.message.text.split(' ').slice(1).join(' ');

    if (!productName) {
      return ctx.reply('Please provide a product name.');
    }

    const response = await axios.get('http://localhost:3003/compare', {
      params: { product: productName },
    });

    ctx.reply(response.data);
  }
}
