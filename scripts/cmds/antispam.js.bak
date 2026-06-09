const axios = require('axios');

module.exports = {
  config: {
    name: "antispam",
    version: "1.0",
    author: "Samuel Kâñèñgeè",
    countDown: 5,
    role: 0,
    shortDescription: "ban user for Spamming",
    longDescription: "ban user for Spamming then Auto unban users",
    category: "owner",
    guide: "{pn}"
  },
  onStart: async function ({ api, event, global }) {
    const num = 5; // number of times spam gets banned -1, for example 5 times 6 times will get banned
    const timee = 60; // During `timee` spam `num` times will be banned

    return api.sendMessage(`╔◇══════♡═══════◇╗\n\n𝙰𝚞𝚝𝚘𝚖𝚊𝚝𝚒𝚌𝚊𝚕𝚕𝚢 𝙱𝚊𝚗 𝚄𝚜𝚎𝚛𝚜 𝙸𝚏 𝚂𝚙𝚊𝚖 ${num} times\𝚗𝚃𝚒𝚖𝚎 : ${timee}s\n\n‎╚◇══════♡═══════◇╝`, event.threadID, event.messageID);
  },
  handleEvent: async function ({ Users, Threads, api, event, global }) {
    let { senderID, messageID, threadID } = event;
    var datathread = (await Threads.getData(event.threadID)).threadInfo;

    if (!global.client.autoban) global.client.autoban = {};
if (!global.client.autoban[senderID]) {
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
    }

    const threadSetting = global.data.threadData.get(threadID) || {};
    const prefix = threadSetting.PREFIX || global.config.PREFIX;
    if (!event.body || event.body.indexOf(prefix) != 0) return;

    if (global.client.autoban[senderID].timeStart + timee * 1000 <= Date.now()) {
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
    } else {
      global.client.autoban[senderID].number++;
      if (global.client.autoban[senderID].number >= num) {
        var namethread = datathread.threadName;
        const moment = require("moment-timezone");
        const timeDate = moment.tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");
        let dataUser = await Users.getData(senderID) || {};
        let data = dataUser.data || {};
        if (data && data.banned == true) return;
        data.banned = true;
        data.reason = `‎╔◇══════♡═══════◇╗\n\𝚗𝚂𝚙𝚊𝚖 𝙱𝚘𝚝 ${num} times/${timee}s\n\n‎╚◇══════♡═══════◇╝` || null;
        data.dateAdded = timeDate;
        await Users.setData(senderID, { data });
        global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });
        global.client.autoban[senderID] = {
          timeStart: Date.now(),
          number: 0
        };
        api.sendMessage(
          senderID + " \𝚗𝙽𝚊𝚖𝚎 : " + dataUser.name + `‎╔◇══════♡═══════◇╗\n\𝚗𝚁𝚎𝚊𝚜𝚘𝚗 : spam bot ${num} times\n𝙰𝚞𝚝𝚘𝚖𝚊𝚝𝚒𝚌𝚊𝚕𝚕𝚢 𝚄𝚗𝚋𝚊𝚗 𝙰𝚏𝚝𝚎𝚛 ${timee} 𝚂𝚎𝚌𝚘𝚗𝚍𝚜\n\n𝚁𝚎𝚙𝚘𝚛𝚝 𝚂𝚎𝚗𝚍 𝚃𝚘 𝙰𝚍𝚖𝚒𝚗\n\n‎╚◇══════♡═══════◇╝`,
          threadID,() => {
            var idad = global.config.ADMINBOT;
            for (let ad of idad) {
              api.sendMessage(
                `‎╔◇══════♡═══════◇╗\n\𝚗𝚂𝚙𝚊𝚖 𝙱𝚊𝚗 𝙽𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗\n\n𝚂𝚙𝚊𝚖 𝙾𝚏𝚏𝚎𝚗𝚍𝚎𝚛𝚜  ${num}/${timee}s\n𝙽𝚊𝚖𝚎: ${dataUser.name} \n𝚄𝚜𝚎𝚛 𝙸𝙳: ${senderID}\n𝙶𝚛𝚘𝚞𝚙 𝙸𝚍: ${threadID} \n𝙶𝚛𝚘𝚞𝚙 𝙽𝚊𝚖𝚎: ${namethread} \n𝚃𝚒𝚗𝚎: ${timeDate}\n\n‎╚◇══════♡═══════◇╝`,
                ad
              );
            }
          }
        );
      }
    }
  }
};
