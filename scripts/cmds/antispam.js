const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "antispam",
    version: "1.1",
    author: "chris st",
    countDown: 5,
    role: 0,
    shortDescription: "Anti-spam automatique",
    longDescription: "Système Minato de détection spam + ban auto",
    category: "owner",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {

    const limit = 5; // nombre de messages spam
    const windowTime = 60; // secondes

    return api.sendMessage(
`🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗔𝗡𝗧𝗜-𝗦𝗣𝗔𝗠 𝗦𝗬𝗦𝗧𝗘𝗠
━━━━━━━━━━━━━━━━━━━
⚡ Surveillance activée

📊 Limite : ${limit} messages
⏱️ Fenêtre : ${windowTime}s

🛡️ Minato protège le système.`,
      event.threadID,
      event.messageID
    );
  },

  handleEvent: async function ({ api, event, Users, Threads, global }) {

    const { senderID, threadID } = event;

    if (!event.body) return;

    // =========================
    // 📊 INIT STORAGE
    // =========================
    if (!global.client.autoban) global.client.autoban = {};
    if (!global.client.autoban[senderID]) {
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
    }

    const limit = 5;
    const windowTime = 60 * 1000;

    // =========================
    // 🔄 RESET WINDOW
    // =========================
    if (Date.now() - global.client.autoban[senderID].timeStart > windowTime) {
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
    }

    global.client.autoban[senderID].number++;

    // =========================
    // 🚨 TRIGGER BAN
    // =========================
    if (global.client.autoban[senderID].number >= limit) {

      const threadInfo = await Threads.getData(threadID);
      const threadName = threadInfo?.threadInfo?.threadName || "Unknown Group";

      const userData = await Users.getData(senderID) || {};
      const name = userData.name || "Unknown";

      const timeDate = moment.tz("Africa/Kinshasa").format("DD/MM/YYYY HH:mm:ss");

      let data = userData.data || {};
      if (data.banned) return;

      data.banned = true;
      data.reason = "Spam détecté par système Minato";
      data.dateAdded = timeDate;

      await Users.setData(senderID, { data });

      global.data.userBanned.set(senderID, {
        reason: data.reason,
        dateAdded: timeDate
      });

      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };

      // =========================
      // 👤 MESSAGE USER
      // =========================
      api.sendMessage(
`🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗝𝗨𝗗𝗚𝗘𝗠𝗘𝗡𝗧
━━━━━━━━━━━━━━━━━━━
⚡ Utilisateur détecté en spam

👤 Nom : ${name}
📛 Statut : BANNI AUTOMATIQUE
⏱️ Durée analyse : ${windowTime / 1000}s

🛡️ Minato a appliqué la sanction.`,
        threadID
      );

      // =========================
      // 👑 ADMIN NOTIFICATION
      // =========================
      const admins = global.config.ADMINBOT;

      for (let ad of admins) {
        api.sendMessage(
`🔔 𝗠𝗜𝗡𝗔𝗧𝗢 𝗔𝗟𝗘𝗥𝗧 — 𝗔𝗗𝗠𝗜𝗡
━━━━━━━━━━━━━━━━━━━
⚠️ Spam détecté

👤 Nom : ${name}
🆔 User ID : ${senderID}
💬 Groupe : ${threadName}
🆔 Groupe ID : ${threadID}

⏱️ Heure : ${timeDate}

🛡️ Action : BAN AUTO`,
          ad
        );
      }
    }
  }
};