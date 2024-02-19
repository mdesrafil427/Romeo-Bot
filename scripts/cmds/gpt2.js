const axios = require('axios');
const tracker = {};

module.exports = {
  config: {
    name: "gpt",
    version: "2.0",
    author: "rehat--",
    countDown: 5,
    role: 0,
    longDescription: "Chat GPT 3.5 Turbo",
    category: "ai",
    guide: { en: "{pn} <query>" },
  },
  clearHistory: function () {
    global.GoatBot.onReply.clear();
  },
  onStart: async function ({ message, event, args, usersData, commandName }) {
    const prompt = args.join(' ');
    const userName = await usersData.getName(event.senderID);
    const userID = event.senderID;
    const mid = event.messageID;

    if (!args[0]) return message.reply('Please enter a query.');

    if (args[0] === 'clear') {
      this.clearHistory();
      const c = await clean(userID);
      if (c) return message.reply('Conversation history cleared.');
    }
    gpt(prompt, userID, message, mid, userName);
  },

  onReply: async function ({ Reply, message, event, args, getLang, usersData }) {
    const { author } = Reply;
    if (author !== event.senderID) return;
    const mid = event.messageID;
    const prompt = args.join(' ');
    const userID = event.senderID;
    const userName = await usersData.getName(event.senderID);
    gpt(prompt, userID, message, mid, userName);
  }
};

async function clean(userID) {
  if (tracker[userID]) {
    delete tracker[userID];
    return true;
  }
  return true;
}

async function gpt(text, userID, message, mid, userName) {
  message.reaction('⏳', mid);
  if (!tracker[userID]) {
    tracker[userID] = `${userName}.\n`;
  }
  tracker[userID] += `${text}.\n`;

  try {
    const url = `https://public-apis-project86.vercel.app/api/chat?query=- Current prompt: ${text}\n\n - Conversation:\n${tracker[userID]}\n`;
    const response = await axios.post(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const resultText = response.data.answer;
    tracker[userID] += `${resultText}`;
    message.reply(`${resultText}\n\nYou can reply to continue chatting.`, (error, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: this.config.name,
        author: userID
      });
    });
    message.reaction('✅', mid);
  } catch (error) {
    message.reaction('❌', mid);
  }
}