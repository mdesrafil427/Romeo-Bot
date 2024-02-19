const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "info2",
    version: "1.0",
    author: "Mesbah Bb'e",
    category: "𝗜𝗡𝗙𝗢",
  },
  
  onStart: async function ({ message }) {
    const botName = global.GoatBot.config.nickNameBot;//your bot name
    const botPrefix = global.GoatBot.config.prefix;//your bot prefix 
    const status = "";//set bot status
    const authorName = "𝗠𝗗 𝗥𝗼𝗺𝗲𝗼 𝗜𝘀𝗹𝗮𝗺 𝗥𝗮𝘀𝗲𝗹";//set your name
    const ownerAge = "19";//set your age
    const authorFB = "www.facebook.com/mdromeoislamrasel.5";//set your Facebook link
   const imgURLs = [
      "https://i.imgur.com/M2bZSef.jpg",
    ];

    const now = moment().tz('Asia/Dhaka');
    const date = now.format('MMMM Do YYYY');
    const time = now.format('h:mm:ss A');
    // Calculate bot uptime
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${hours}hrs: ${minutes}min: ${seconds}sec`;

    message.reply({
      body: `===「 𝘽𝙤𝙩 & 𝙤𝙬𝙣𝙚𝙧 𝙄𝙣𝙛𝙤  」===\n❏Bot Name: ${botName}\n❏Bot Prefix: ${botPrefix}\n❏Status: ${status}\n❏Author Name: ${authorName}\n❏Author Facebook: ${authorFB}\n❏Date: ${date}\n❏Time: ${time}\n❏𝐁𝐨𝐭 𝐑𝐮𝐧𝐧𝐢𝐧𝐠: ${uptimeString}\n=====================`,
      attachment: await global.utils.getStreamFromURL(link)
    });
  },

  onChat: async function({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.onStart({ message });
    }
  }
};