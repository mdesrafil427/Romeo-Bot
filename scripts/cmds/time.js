      const apiKey = '0Hr3RnpBTgQvQ9np4ibDrQ==CkYJq9yAT5yk6vIn'; // add your own apikey
      const apiUrl = `https://api.api-ninjas.com/v1/worldtime?city=${encodeURIComponent(cityName)}`;
      const response = await axios.get(apiUrl, { headers: { 'X-Api-Key': apiKey } });

    
      const { timezone, datetime, day_of_week, year, month } = response.data;

   
      const currentTime = datetime.split(' ')[1]; 
      const message = `𝗧𝗜𝗠𝗘𝗭𝗢𝗡𝗘 𝗢𝗙: ${timezone}\n𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗧𝗜𝗠𝗘: ${currentTime}\n𝗬𝗘𝗔𝗥:${year}\n𝗠𝗢𝗡𝗧𝗛:${month}\n𝗗𝗔𝗬: ${day_of_week}`;
      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
 
      api.sendMessage("Error fetching time information\nadd your own api key in code", event.threadID, event.messageID);
    }
  },
};

/*
in future if code stop working 
add your own apikey in code there is guide
you can get apikey from ninja pai web
*/