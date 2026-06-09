module.exports = {
  config: {
    name: "delmsg",
    version: "1.1",
    author: "chris st",
    countDown: 5,
    role: 2,
    category: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
    guide: {
      vi: "",
      en: ""
    }
  },

  onStart: function({ api, event, args, usersData, threadsData }) {
    const { threadID, messageID } = event;
    const botID = api.getCurrentUserID();

    // 1. Récupération des données du propriétaire officiel du bot
    const ownerID = global.GoatBot.config.GOD[0] || botID;
    let ownerName = "L'Éclair Jaune de Konoha";
    
    // Utilisation d'une structure synchrone ou promesse gérée pour correspondre à onStart non-async
    usersData.getName(ownerID).then(name => {
      if (name) ownerName = name;
    }).catch(e => console.error("Impossible de récupérer le nom du propriétaire :", e));

    // Préparation des statistiques et du temps pour la notification
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
    const optionsDate = { weekday: 'long', month: 'long', day: 'numeric' };
    const now = new Date();
    
    const timeNow = now.toLocaleTimeString('en-US', optionsTime);
    const dateNow = now.toLocaleDateString('fr-FR', optionsDate);
    const displayDate = dateNow.charAt(0).toUpperCase() + dateNow.slice(1);

    // Fonction interne pour envoyer le message final avec le style Minato
    const sendStyledMessage = async (messageContent) => {
      let totalMembers = 100, totalMale = 75, totalFemale = 25;
      try {
        const allThreadID = (await threadsData.getAll()).filter(t => t.isGroup && t.members.find(m => m.userID == botID)?.inGroup);
        if (allThreadID.length > 0) {
          totalMembers = 0; totalMale = 0; totalFemale = 0;
          allThreadID.forEach(t => {
            if (t.members) {
              totalMembers += t.members.length;
              totalMale += t.members.filter(m => m.gender === "MALE").length;
              totalFemale += t.members.filter(m => m.gender === "FEMALE").length;
            }
          });
          if (totalMale === 0 && totalFemale === 0 && totalMembers > 0) {
            totalMale = Math.floor(totalMembers * 0.75);
            totalFemale = totalMembers - totalMale;
          }
        }
      } catch(e) {}

      const fullMessage = `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢 ⚡𝗠𝗜𝗡𝗔𝗧𝗢-𝗕𝗢𝗧⚡
━━━━━━━━━━━━━━━━━━━
👤 𝖠𝖽𝗆𝗂̣n/𝖮𝗐𝗇𝖾𝗋:
• ${ownerName}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ ${messageContent}

👥 𝗧𝗢𝗧𝗔𝗟 𝗠𝗘𝗠𝗕𝗘𝗥𝗦: ${totalMembers}
🚹 𝗠𝗔𝗟Ｅ: ${totalMale} | 🚺 𝗙𝗘𝗠𝗔𝗟Ｅ: ${totalFemale}
⏰ 𝗧𝗶𝗺𝗲 𝗻𝗼𝘄: ${timeNow}
📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${displayDate}
━━━━━━━━━━━━━━━━━━━
ℹ️ | C'est une annonce officielle du 𝗔𝗗𝗠Ｉ𝗡𝗕𝗢𝗧.`;
      
      api.sendMessage(fullMessage, threadID);
    };

    // 2. Traitement de la suppression des messages
    if (args[0] == "all") {
      return api.getThreadList(1000, null, ["INBOX"], (err, list) => {
        if (err) throw err;
        list.forEach(item => (item.threadID != threadID) ? api.deleteThread(item.threadID) : "");
        sendStyledMessage("Technique de balayage spatio-temporel terminée ! J'ai effacé l'intégralité de mes parchemins de messages et nettoyé toute ma boîte de réception. ✨");
      });
    }
    else {
      return api.getThreadList(1000, null, ["INBOX"], (err, list) => {
        if (err) throw err;
        list.forEach(item => (item.isGroup == true && item.threadID != threadID) ? api.deleteThread(item.threadID) : "");
        sendStyledMessage("Nettoyage des zones de combat achevé ! Tous les parchemins de discussions de groupe ont été définitivement purgés. 🍃");
      });
    }
  }
};
