module.exports = {
  config: {
    name: "ai",
    aliases: ["gpt", "chatgpt", "gpt5"],
    version: "2.5",
    author: "chris st",
    countDown: 0,
    role: 0,
    shortDescription: "Chat with GPT-5",
    longDescription: "Talk with GPT-5 AI",
    category: "AI",
    guide: "Ai <message>"
  },

  onStart: async ({ api, event, args }) => {
    const user = await getUserName(api, event.senderID);
    const q = args.join(" ").trim();

    if (!q) {
      return api.sendMessage(
`⚡ 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘 ⚡
━━━━━━━━━━━━━━━━━━━
👤 À l'attention de : ${user}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 🍃 | 𝗟𝗘 𝗤𝗨𝗔𝗧𝗥𝗜𝗘̀𝗠𝗘 𝗛𝗢𝗞𝗔𝗚𝗘
╰┈➤ Salut ${user} ! 

C'est un plaisir de te croiser. Je suis Minato Namikaze, l'Éclair Jaune de Konoha. 

Si tu as besoin de mon aide ou si tu veux simplement discuter, utilise plutôt mon préfixe minato. Je serai là en un éclair !

📅 Date : ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
✨ Prêt à protéger le village.`,
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
`⚡ 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘 ⚡
━━━━━━━━━━━━━━━━━━━
👤 À l'attention de : ${user}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 🍃 | 𝗟𝗘 𝗤𝗨𝗔𝗧𝗥𝗜𝗘̀𝗠𝗘 𝗛𝗢𝗞𝗔𝗚𝗘
╰┈➤ Désolé ${user}, 

Je ne peux pas te répondre directement via cette commande standard. 

Utilise le préfixe minato pour faire appel à ma vitesse, et je te répondrai personnellement avec plaisir !

📅 Date : ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
✨ Message transmis par l'Éclair Jaune.`,
      event.threadID,
      event.messageID
    );
  },

  onChat: async ({ api, event }) => {
    const body = (event.body || "").trim();
    const m = body.match(/^(ai)\s*(.*)/i);

    if (!m) return;

    const user = await getUserName(api, event.senderID);

    if (!m[2] || m[2].trim() === "") {
      return api.sendMessage(
`⚡ 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘 ⚡
━━━━━━━━━━━━━━━━━━━
👤 À l'attention de : ${user}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 🍃 | 𝗟𝗘 𝗤𝗨𝗔𝗧𝗥𝗜𝗘̀𝗠𝗘 𝗛𝗢𝗞𝗔𝗚𝗘
╰┈➤ Salut ${user} ! 

C'est un plaisir de te croiser. Je suis Minato Namikaze, l'Éclair Jaune de Konoha. 

Si tu as besoin de mon aide ou si tu veux simplement discuter, utilise plutôt mon préfixe minato. Je serai là en un éclair !

📅 Date : ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
✨ Prêt à protéger le village.`,
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
`⚡ 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘 ⚡
━━━━━━━━━━━━━━━━━━━
👤 À l'attention de : ${user}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 🍃 | 𝗟𝗘 𝗤𝗨𝗔𝗧𝗥𝗜𝗘̀𝗠𝗘 𝗛𝗢𝗞𝗔𝗚𝗘
╰┈➤ Désolé ${user}, 

Je ne peux pas te répondre directement via cette commande standard. 

Utilise le préfixe minato pour faire appel à ma vitesse, et je te répondrai personnellement avec plaisir !

📅 Date : ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
✨ Message transmis par l'Éclair Jaune.`,
      event.threadID,
      event.messageID
    );
  }
};

async function getUserName(api, userID) {
  try {
    const info = await api.getUserInfo(userID);
    return info[userID]?.name || "Ninja de passage";
  } catch {
    return "Ninja de passage";
  }
}
