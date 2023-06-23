import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

export async function botInit(apiToken: string) {
 
}

export async function botSend(message: string, address: string) {
  const BOT_TOKEN = process.env.BOT_TOKEN
  const bot = new Telegraf(String(BOT_TOKEN));
  bot.telegram.sendMessage(Number(address), message);

  console.log('bot');
}