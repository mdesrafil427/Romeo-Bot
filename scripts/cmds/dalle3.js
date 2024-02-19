 const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FAByBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACIfTOiMkgX66MARqkWjVL6GXx39XU4TyZtsBAC2TXnSuzy1HvV6ajbpABtNZuhNYbqynrGDCnkJbgbnMfduxrPJkCDVklVUbr9NnnH7s9v/TDmmQ8iHLfGFFm3Dt8LcvnZzrh8TgawqJc9ktBqRMMJVvy35nQwfOX3Osy1Xoh+Yd13yi0EhuQ0ee+rmAKeYoqxPg/71MZGQad9PfexO4K+UHrxAqpusK6fuUynypqJq3jeoegYOMjGGY64oiXcoW6DxwXnP7OsUk8KakxpXfT9CSmqfWQ3dPCSEKWVReCUjHPu+hAeZSmUgaCw7/TNnmaEntAMA07S7twOnUVU5nbv2gEnF9Nr2hpOVSArVBn5K9MAKTo70boKMpvhC3mcUSSErs+xt65ZbZKDDRVgRK5UfvVbHkIM6tVJqmRZSSs58F9jylOTdQ1IeXT5KnWIXwL/MVoYe0lYY7CtrIaBWdHl95WvXc8Uyw8Yn7N6AfbsryspzM19Fyo7ErefCJVF3jfcc/yTaFIbEyjXYaTknGSE6n8sbc6gVlkeVIcDbQHJw0qJKpw0GlDLGK7fQuZdMJOd/7DTjUw2tLN2xDdyVA0TGIuZZQ96zCA7RwNxHIPArI+46ttcSD3zyheGtvk/BsCloGpVkg3qXBZHs/s7AXR92SoAZd0WfpzaCYIJTPzZ0BMud7KjeKGUWAI0RLEreupdGEnUOt6eh3i4HmtJtG2ymGt9NI4LdBNiwXvuCHq81efQrdNiWmBwqev0g2rKRgx0iVjgcOKXhX550fiO4DKoVsMePNlV10sd/bfa7MT6ENZjIvr03SEgPkMiPZyEkruUpiVpfGMY798jJkgFMkpk4IhTe6CW7LKwvwyYwadIxNw4IXMBxidaFvW5yNVGfnKRl8tM0AvtyrBeVFpCAq1AQppfq88H1P2J2hEk4IZnO9w4b4/lFIzF+Uw7nbtYehwp+1YxmBlKCAbNNxuk4C06yLbFZwUpK727qJKIKeaXIvJdknAEUAf3TTkuysrtPVmrm70OAOZaxErD4vTSzv2iejb5PVvvI1vkCm8oeYvT80QTTomvfKfAHAwbecOXWIv5xj6Icgp6MTfvLxd8aqVSZE/CtI7Ar8E4hdKDire/O+c9ijVPilNJyGL9qC41G/8vLK5On4Wrh/yiKvTfWzhrPGLxCVaiAWYf6zyOPsIWcwsKwAisrmTjzMk6tC/sdKd6VKXZ+SxiN49RtRvHQ3JSBOc+f+w7qIksujwrfArzTugsQw/249QowQLOn2pgqlcyws84lv5V7qW4V9SCixc6Rlr+Z2sTOvkBbH3m0z/pMr5sLr74+O1xB6CvlWMNpWxyZY5LV+H8YFQDbUE8FYCShw0cWYHKDqKVBcfaDvLRKecFh/uN8oATXxX+otYphB5dmWB37MXUgiUWa1MeSkVP2DFU3UJjXEs8lOFACYF+ukwj3YqRDIJpwijdBfSynNOQ==";
const _U = "175aRTI7KvsWUgC-cb4pH1xf7ixFYrDEMZIfoHueFSTWuM8vwE_itgzU8MUJ366oK_Gz5AZusssw4mcmLMeSoNTgW2DC3c6st-4JKHsB3ARWW97UHnC0WOTks-ApGAZSPL8ARJEccjCfd0D-qIJrpsFp3KVuCibzKPFVXa6e97_X7jYAXbXrZD7NjxhwNXN8QItbV4Fsqv7ObKz25cP_-WQ";
module.exports = {
  config: {
    name: "dalle",
    aliases: ["dalle3"],
    version: "1.0.2",
    author: "Samir Œ ",
    role: 0,
    countDown: 5,
    shortDescription: {
      en: "dalle"
    },
    longDescription: {
      en: ""
    },
    category: "dalle",
    guide: {
      en: "{prefix}dalle <search query> -<number of images>"
    }
  },

  onStart: async function ({ api, event, args }) {

const uid = event.senderID
    const permission = [`${uid}`];
    if (!permission.includes(event.senderID)) {
      api.sendMessage(
        "You don't have enough permission to use this command. Only admin can do it.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const keySearch = args.join(" ");
    const indexOfHyphen = keySearch.indexOf('-');
    const keySearchs = indexOfHyphen !== -1 ? keySearch.substr(0, indexOfHyphen).trim() : keySearch.trim();
    const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 4;

    try {
      const res = await axios.get(`https://api-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(keySearchs)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("No images found for the provided query.", event.threadID, event.messageID);
        return;
      }

      const imgData = [];
      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image`
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("cookie of the command. Is expired", event.threadID, event.messageID);
    } finally {
      await fs.remove(path.join(__dirname, 'cache'));
    }
  }
};