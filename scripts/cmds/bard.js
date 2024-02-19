const axios = require("axios");
const fs = require("fs");
const cookie = 'g.a000fwjptPSvas4-tIzkH5vrXYp07o-hK1QimucEp95_iZbA4bR_Sf6XMdp5RCiaj4P2kpVmSQACgYKAUUSAQASFQHGX2Mi8jHvLo9-wyABfHe66eGGIhoVAUF8yKofO7gLTeg1tFzq5NI6avtg0076';

/*
I will keep updating the API, so in the future, there may be changes in the command bard API project created by Rehat86. If any errors occur, contact me on Telegram at t.me/Reaht86. Please don't contact me on Facebook as I may be slow to respond there. Here is my Facebook profile: www.facebook.com/tu33rtle.xy. The bard project is still in beta, and in the future, I will update it soon and try to cover all APIs. Please do not change the credits, as it will demotivate me to create API projects for free.

Now, here is the tutorial link on how to get the bard cookie. The process is the same on a computer, but I'm showing the mobile tutorial because many people use mobile devices.

Here is the video link: 
https://youtu.be/yp-p370BEhY?si=Or8pAmjgSaCIFGjL
*/

module.exports = {
  config: {
    name: "bard",
    version: "1.0",
    author: "rehat--",
    countDown: 5,
    role: 0,
    longDescription: { en: "Artificial Intelligence Google Bard" },
    guide: { en: "{pn} <query>" },
    category: "ai",
  },
  clearHistory: function () {
    global.GoatBot.onReply.clear();
  },

  onStart: async function ({ message, event, args, commandName }) {
    const uid = event.senderID;
    const prompt = args.join(" ");

    if (!prompt) {
      message.reply("Please enter a query.");
      return;
    }

    if (prompt.toLowerCase() === "clear") {
      this.clearHistory();
      const clear = await axios.get(`https://project-bard.onrender.com/api/bard?query=clear&uid=${uid}&cookie=${cookie}`);
      message.reply(clear.data.message);
      return;
    }

    if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0].type === "photo") {
      const photo = encodeURIComponent(event.messageReply.attachments[0].url);
      const query = args.join(" ");
      const url = `https://turtle-apis.onrender.com/api/gemini/img?prompt=${encodeURIComponent(query)}&url=${photo}`;
      const response = await axios.get(url);
      message.reply(response.data.answer);
      return;
    }

    const apiUrl = `https://project-bard.onrender.com/api/bard?query=${encodeURIComponent(prompt)}&uid=${uid}&cookie=${cookie}`;
    try {
      const response = await axios.get(apiUrl);
      const result = response.data;

      let content = result.message;
      let imageUrls = result.imageUrls;

      let replyOptions = {
        body: content,
      };

      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageStreams = [];

        if (!fs.existsSync(`${__dirname}/cache`)) {
          fs.mkdirSync(`${__dirname}/cache`);
        }

        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          const imagePath = `${__dirname}/cache/image` + (i + 1) + ".png";

          try {
            const imageResponse = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });
            fs.writeFileSync(imagePath, imageResponse.data);
            imageStreams.push(fs.createReadStream(imagePath));
          } catch (error) {
            console.error("Error occurred while downloading and saving the image:", error);
            message.reply('An error occurred.');
          }
        }

        replyOptions.attachment = imageStreams;
      }

      message.reply(replyOptions, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      });
    } catch (error) {
      message.reply('An error occurred.');
      console.error(error.message);
    }
  },

  onReply: async function ({ message, event, Reply, args }) {
    const prompt = args.join(" ");
    let { author, commandName, messageID } = Reply;
    if (event.senderID !== author) return;

    try {
      const apiUrl = `https://project-bard.onrender.com/api/bard?query=${encodeURIComponent(prompt)}&uid=${author}&cookie=${cookie}`;
      const response = await axios.get(apiUrl);

      let content = response.data.message;
      let replyOptions = {
        body: content,
      };

      const imageUrls = response.data.imageUrls;
      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageStreams = [];

        if (!fs.existsSync(`${__dirname}/cache`)) {
          fs.mkdirSync(`${__dirname}/cache`);
        }
        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          const imagePath = `${__dirname}/cache/image` + (i + 1) + ".png";

          try {
            const imageResponse = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });
            fs.writeFileSync(imagePath, imageResponse.data);
            imageStreams.push(fs.createReadStream(imagePath));
          } catch (error) {
            console.error("Error occurred while downloading and saving the image:", error);
            message.reply('An error occurred.');
          }
        }
        replyOptions.attachment = imageStreams;
      }
      message.reply(replyOptions, (err, info) => {
        if (!err) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      });
    } catch (error) {
      console.error(error.message);
      message.reply("An error occurred.");
    }
  },
};