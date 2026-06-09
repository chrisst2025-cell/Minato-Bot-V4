const axios = require("axios");

const botName = "Minato Namikaze";

// 🧠 Mémoire locale : Stocke l'historique des discussions par utilisateur (senderID)
const conversationHistory = {};

module.exports = {
  config: {
    name: "minato",
    version: "3.5.0",
    author: "Chris st",
    role: 0,
    shortDescription: "IA Minato Namikaze avec mémoire",
    longDescription: "IA intelligente, personnalisée, stylée et capable de se souvenir de la discussion.",
    category: "minato",
    guide: "minato <question> ou .minato <question>",
    countDown: 5
  },

  onStart: async function (args) {
    return this.handleAI(args);
  },

  onChat: async function (args) {
    const { event, api, message } = args;

    if (!event.body) return;

    const content = event.body.trim().toLowerCase();
    const isMentioned = event.mentions?.[api.getCurrentUserID()];

    // 🔒 Anti-spam groupe
    if (
      event.isGroup &&
      !isMentioned &&
      !content.startsWith("minato") &&
      !content.startsWith(".minato")
    ) return;

    // ✅ Si "minato" seul (Message d'aide)
    if (content === "minato" || content === ".minato") {
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
👤Nom d'utilisateur :
• ${event.senderID}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 🤖 | 👑 𝗜𝗔 𝗔𝗖𝗧𝗜𝗩𝗘 (𝗔𝘃𝗲𝗰 𝗠𝗲́𝗺𝗼𝗶𝗿𝗲)
╰┈➤ 💬 Pose-moi une question et je vais te répondre en me rappelant de notre discussion.\n\n✨ Exemple :\nminato Comment coder ?

📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Réponse générée par 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘.`
      );
    }

    // ✅ Si "ai question"
    if (
      content.startsWith("minato ") ||
      content.startsWith("@minato ")
    ) {
      const splitBody = event.body.split(" ");
      splitBody.shift();
      args.args = splitBody;
      return this.handleAI(args);
    }
  },

  handleAI: async function ({ args, message, event }) {
    const userQuestion = args.join(" ");
    const userId = event.senderID;

    // ✅ Question manquante
    if (!userQuestion) {
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
👤Nom d'utilisateur :
• ${userId}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ⚠️ | 𝗤𝗨𝗘𝗦𝗧𝗜𝗢𝗡 𝗠𝗔𝗡𝗤𝗨𝗔𝗡𝗧𝗘
╰┈➤ Veuillez écrire une question pour utiliser minato.\n\n✨ Exemple :\nminato Explique JavaScript

📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Réponse générée par 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘.`
      );
    }

    try {
      // Initialiser l'historique pour l'utilisateur s'il n'existe pas
      if (!conversationHistory[userId]) {
        conversationHistory[userId] = [];
      }

      // Ajouter la nouvelle question de l'utilisateur à sa mémoire locale
      conversationHistory[userId].push(`Utilisateur: ${userQuestion}`);

      // Garder uniquement les 10 derniers échanges pour éviter de saturer l'API (limite de caractères)
      if (conversationHistory[userId].length > 10) {
        conversationHistory[userId].shift();
      }

      // 🧠 SYSTEM PROMPT
      const systemPrompt = `
Tu t'appelles ${botName}.
Tu es une intelligence artificielle avancée.

🧠 COMPORTEMENT
- Tu es intelligente, utile et claire.
- Tu as de la mémoire : prends bien en compte l'historique de la discussion ci-dessous pour répondre de manière cohérente au dernier message.
- Tu expliques simplement ou en détail selon le besoin.

⚠️ IDENTITÉ
- Ton nom est ${botName}.
- Ne parle pas inutilement de ton créateur.

🎯 QUALITÉ
- Réponses précises
- Réponses utiles
- Exemples si nécessaire

💬 STYLE
- Style aesthetic ✨
- Naturel et fluide
`;

      // On construit le prompt final contenant TOUT l'historique de la discussion en cours
      const historyText = conversationHistory[userId].join("\n");
      const fullPrompt = `${systemPrompt}\n\n━━━━━━━━━━━━━━━━━━\n📜 HISTORIQUE DE LA DISCUSSION :\n${historyText}\n━━━━━━━━━━━━━━━━━━\nMinato:`;

      // ✅ Message d'attente
      const waitMsg =
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
👤Nom d'utilisateur :
• ${userId}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ⏳ | 𝗣𝗔𝗧𝗜𝗘𝗡𝗧𝗘𝗭
╰┈➤ ${botName} réfléchit à votre question...

📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Réponse générée par 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘.`;

      await message.reply(waitMsg);

      const response = await axios.get(
        "https://delfaapiai.vercel.app/ai/chatgptfree",
        {
          params: {
            prompt: fullPrompt,
            model: "chatgpt4",
            userId: userId // Ajout de l'ID au cas où l'API distante le gère nativement
          }
        }
      );

      const output =
        response.data.answer ||
        response.data.reply ||
        response.data.result ||
        response.data.message;

      // ✅ Réponse IA Réussie
      if (output) {
        // Ajouter la réponse du bot à l'historique pour la prochaine fois
        conversationHistory[userId].push(`Minato: ${output}`);

        return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
👤Nom d'utilisateur :
• ${userId}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 🤖 | 👑 𝗥𝗘́𝗣𝗢𝗡𝗦𝗘
╰┈➤ ${output}

📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Réponse générée par 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜鍵𝗔𝗭𝗘.`
        );
      } else {
        // ⚠️ Aucune réponse reçue
        return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
👤Nom d'utilisateur :
• ${userId}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ⚠️ | 𝗔𝗨𝗖𝗨𝗡𝗘 𝗥𝗘́𝗣𝗢𝗡𝗦𝗘
╰┈➤ Impossible d'obtenir une réponse actuellement.

📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Réponse générée par 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜鍵𝗔𝗭𝗘.`
        );
      }

    } catch (error) {
      console.error("Erreur API:", error);

      // ❌ Erreur API
      return message.reply(
`🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢
𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜𝗞𝗔𝗭𝗘
━━━━━━━━━━━━━━━━━━━
👤Nom d'utilisateur :
• ${userId}
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ ❌ | 𝗘𝗥𝗥𝗘𝗨𝗥 𝗔𝗣𝗜
╰┈➤ Une erreur est survenue avec l'API. Réessayez plus tard.

📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${new Date().toDateString()}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Réponse générée par 𝗠𝗜𝗡𝗔𝗧𝗢 𝗡𝗔𝗠𝗜鍵𝗔𝗭𝗘.`
      );
    }
  }
};
  
