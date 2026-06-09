const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "wallpaper",
    aliases: ["wl"],
    version: "2.0",
    author: "chris st",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "get wallpaper"
    },
    longDescription: {
      en: "get wallpaper with Minato Namikaze style"
    },
    category: "tools",
    guide: {
      en: "wallpaper <query>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const timeNow = moment.tz("Africa/Kinshasa").format("hh:mm A");
    const dateNow = moment.tz("Africa/Kinshasa").format("dddd, MMMM D");

    // Fonction pour créer le template avec stats du groupe
    const getNotificationStyle = async (mainMessage) => {
      let totalMembers = 0, maleCount = 0, femaleCount = 0;
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        totalMembers = threadInfo.participantIDs.length;

        const userInfo = await api.getUserInfo(threadInfo.participantIDs);
        for (const uid of threadInfo.participantIDs) {
          if (userInfo[uid]?.gender === 2) maleCount++;
          else if (userInfo[uid]?.gender === 1) femaleCount++;
        }
      } catch (e) {
        console.error("Erreur stats groupe:", e);
      }

      return `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
 MINATO NAMIKAZE
━━━━━━━━━━━━━━━━━━━
👤 𝗔𝗱𝗺𝗶𝗻/𝗢𝘄𝗻𝗲𝗿:
• Chris St
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ ${mainMessage}

👥 𝗧𝗢𝗧𝗔𝗟 𝗠𝗘𝗠𝗕𝗘𝗥𝗦: ${totalMembers}
🚹 𝗠𝗔𝗟𝗘: ${maleCount} | 🚺 𝗙𝗘𝗠𝗔𝗟𝗘: ${femaleCount}
⏰ 𝗧𝗶𝗺𝗲 𝗻𝗼𝘄: ${timeNow}
📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${dateNow}
━━━━━━━━━━━━━━━━━━━
⚡ Informations fournies par Minato Namikaze`;
    };

    // Si pas de query
    if (args.length === 0) {
      const msg = await getNotificationStyle("❌ Veuillez fournir un terme de recherche.\n\n📌 Exemple : wallpaper anime");
      return api.sendMessage(msg, threadID, messageID);
    }

    const apiKey = "39178311-acadeb32d7e369897e41dba06";
    const query = encodeURIComponent(args.join(" "));
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&per_page=200`;

    try {
      const response = await axios.get(apiUrl);
      const wallpapers = response.data.hits.filter(function(wallpaper) {
        const imageUrl = wallpaper.largeImageURL;
        const imageExtension = path.extname(imageUrl);
        return imageExtension === ".jpg" || imageExtension === ".png";
      });

      if (wallpapers.length === 0) {
        const msg = await getNotificationStyle(`❌ Aucun wallpaper trouvé pour : ${args.join(" ")}`);
        return api.sendMessage(msg, threadID, messageID);
      }

      let streams = [];
      let counter = 0;

      for (const wallpaper of wallpapers) {
        if (counter >= 10) break;

        const imageUrl = wallpaper.largeImageURL;
        const imageExtension = path.extname(imageUrl);
        let imagePath = path.join(__dirname, `/cache/wallpaper${counter}${imageExtension}`);
        let hasError = false;

        try {
          const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
          fs.writeFileSync(imagePath, Buffer.from(imageResponse.data, "binary"));
        } catch (error) {
          console.error(error);
          hasError = true;
        }

        if (!hasError) {
          streams.push(fs.createReadStream(imagePath).on("end", function() {
            if (fs.existsSync(imagePath)) {
              fs.unlink(imagePath, function(err) {
                if (err) console.error(err);
              });
            }
          }));
          counter += 1;
        }
      }

      if (streams.length > 0) {
        const body = await getNotificationStyle(`📷 Résultat Wallpaper : ${args.join(" ")}\n🔢 Total : ${streams.length} images`);
        let msg = {
          body: body,
          attachment: streams
        };
        api.sendMessage(msg, threadID, messageID);
      } else {
        const msg = await getNotificationStyle("❌ Une erreur est survenue lors du téléchargement des wallpapers.");
        api.sendMessage(msg, threadID, messageID);
      }

    } catch (error) {
      console.error(error);
      const msg = await getNotificationStyle("❌ Erreur lors de la récupération des wallpapers.");
      api.sendMessage(msg, threadID, messageID);
    }
  }
};