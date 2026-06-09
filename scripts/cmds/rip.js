const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "rip",
    version: "1.1",
    author: "MILAN",
    countDown: 5,
    role: 0,
    shortDescription: "image RIP",
    longDescription: "génère une image RIP",
    category: "amusant",
    guide: {
      fr: "{pn} [@tag | vide]",
    }
  },

  onStart: async function ({ event, message, usersData }) {
    const uid = Object.keys(event.mentions)[0];
    if (!uid) return message.reply("⚠️ Veuillez mentionner quelqu'un.");

    const avatarURL = await usersData.getAvatarUrl(uid);
    const img = await new DIG.Rip().getImage(avatarURL);
    const pathSave = `${__dirname}/tmp/${uid}_Rip.png`;
    fs.writeFileSync(pathSave, Buffer.from(img));

    message.reply({
      body: `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗙𝗥𝗢𝗠 𝗠𝗜𝗡𝗔𝗧𝗢
━━━━━━━━━━━━━━━━━━━
👤𝖠𝖽𝗆𝗂𝗇/𝖮𝗐𝗇𝖾𝗋:
• Chris st
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ Voici l'image RIP de la personne mentionnée. 🕊️`,
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};
