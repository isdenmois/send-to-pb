const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
require("dotenv").config();

const settings = {};

if (process.env.TELEGRAM_BOT_PROXY) {
  const SocksAgent = require("socks5-https-client/lib/Agent");
  const socksAgent = new SocksAgent({
    socksHost: process.env.TELEGRAM_BOT_PROXY,
    socksPort: +process.env.TELEGRAM_BOT_PROXY_PORT,
    socksUsername: process.env.TELEGRAM_BOT_PROXY_USERNAME,
    socksPassword: process.env.TELEGRAM_BOT_PROXY_PASSWORD
  });

  settings.telegram = {
    agent: socksAgent
  };
}
const dataService = require("./dataService");
const email = require('./email');

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(token, settings);

bot.on("document", ctx => {
  const doc = ctx.message.document;
  const name = doc.file_name && doc.file_name.toLowerCase() || '';
  if (!name.endsWith('.fb2.zip') && !name.endsWith('.fb2') && !name.endsWith('.epub')) {
    ctx.reply('Support only fb2, fb2.zip and epub files');
    return;
  }
  const emailAddress = dataService.getEmail(ctx.message.from.username);

  if (!emailAddress) {
    ctx.reply(`Email address for ${ctx.message.from.username} did't set`);
    return;
  }

  ctx.telegram.getFile(doc.file_id)
  .then(file => {
    return email.send(emailAddress, doc.file_name, [
      {
        filename: doc.file_name,
        path: `https://api.telegram.org/file/bot${token}/${file.file_path}`
      }
    ]);
  })
  .then(() => ctx.reply('File has successfully sent!'))
  .catch(error => {
    console.error(error);
    ctx.reply('I can\'t sent this file :(');
  });
});

bot.launch();
