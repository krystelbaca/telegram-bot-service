import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import axios from 'axios';

@Injectable()
export class AppService {
  private bot: Telegraf;

  constructor() {
    const telegramApiKey = process.env.TELEGRAM_API_KEY;
    if (!telegramApiKey) {
      throw new Error('TELEGRAM_API_KEY is not set');
    }

    this.bot = new Telegraf(telegramApiKey);

    this.bot.start((ctx) =>
      ctx.reply(
        'Welcome to ChooseCheap Bot! Use /search <product> to get the best price.',
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

    try {
      const response = await axios.get('http://localhost:8000/compare', {
        params: { product: productName },
      });
      const comparison = response.data;

      const amazon = comparison.amazon;
      const mercadoLibre = comparison.mercadoLibre;

      ctx.reply(
        `Amazon:\nNombre: ${amazon.Nombre}\nDescripción: ${amazon.Descripción}\nPrecio: ${amazon.Precio}\nImagen: ${amazon.Imagen}\nURL: ${amazon.URL}\n\n` +
          `Mercado Libre:\nNombre: ${mercadoLibre.Nombre}\nDescripción: ${mercadoLibre.Descripción}\nPrecio: ${mercadoLibre.Precio}\nImagen: ${mercadoLibre.Imagen}\nURL: ${mercadoLibre.URL}`,
      );
    } catch (error) {
      console.error('Error comparing prices:', error);
      ctx.reply('Failed to compare prices. Please try again later.');
    }
  }
}
