const gtts = require("google-tts-api");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

module.exports = {
	config: {
		name: "say",
		version: "2.1",
		author: "chris st",
		usePrefix: true,
		countDown: 3,
		role: 0,
		description: {
			fr: "Transforme ton texte en un message vocal stylisé !",
		},
		category: "fun",
		guide: {
			fr: "{pn} <style> <texte>\n\n🎭 Styles disponibles :\n- male\n- female\n- funny\n- robot\n- deep\n- slow",
		}
	},

	onStart: async function ({ message, args }) {
		// Date et heure pour le design du message
		const optionsDate = { weekday: 'long', month: 'long', day: 'numeric' };
		const dateNow = new Date().toLocaleDateString('fr-FR', optionsDate);
		const timeNow = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

		// Si les arguments sont insuffisants
		if (args.length < 2) {
			const usageReply = `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢 
 MINATO NAMIKAZE 
━━━━━━━━━━━━━━━━━━━
👤 𝖠𝖽𝗆𝗂𝗇/𝖮𝗐𝗇𝖾𝗋:
• Kyle
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ 🗣️ *Erreur de transmission :* Tu dois spécifier un style et un texte !
Exemple : "say funny Bonjour de Konoha !"

🎭 *Styles disponibles :* male, female, funny, robot, deep, slow
━━━━━━━━━━━━━━━━━━━
ℹ️ | Guide d'utilisation de l'𝗔𝗗𝗠𝗜𝗡𝗕𝗢𝗧.`;
			return message.reply(usageReply);
		}

		const style = args[0].toLowerCase();
		const text = args.slice(1).join(" ");

		// Configuration de la langue (fr pour le français)
		const lang = "fr"; 

		let pitch = 1.0; 
		let speed = 1.0; 

		switch (style) {
			case "male":
				pitch = 0.9;
				break;
			case "female":
				pitch = 1.2;
				break;
			case "funny":
				pitch = 2.0;
				speed = 1.5;
				break;
			case "robot":
				pitch = 0.8;
				speed = 0.9;
				break;
			case "deep":
				pitch = 0.6;
				break;
			case "slow":
				speed = 0.6;
				break;
			default:
				const styleError = `⚡ *Style inconnu !* Choisis parmi ceux-là : male, female, funny, robot, deep, slow.`;
				return message.reply(styleError);
		}

		try {
			// Récupération du lien audio via Google TTS
			const audioUrl = gtts.getAudioUrl(text, {
				lang,
				slow: speed < 1,
				host: "https://translate.google.com",
			});

			const filePath = path.join(__dirname, "voice.mp3");
			const response = await fetch(audioUrl);
			const buffer = await response.arrayBuffer();
			fs.writeFileSync(filePath, Buffer.from(buffer));

			// Message d'annonce avant d'envoyer le vocal
			const successReply = `🔔 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 𝗧𝗢 
 MINATO NAMIKAZE 
━━━━━━━━━━━━━━━━━━━
👤 𝖠𝖽𝗆𝗂𝗇/𝖮𝗐𝖾𝗋:
• Kyle
━━━━━━━━━━━━━━━━━━━
╭┈ ❒ 📬 | 𝗠𝗘𝗦𝗦𝗔𝗚𝗘:
╰┈➤ ⚡ *Technique de téléportation vocale !* Voici ton message converti avec le style [${style.toUpperCase()}] :
━━━━━━━━━━━━━━━━━━━
⏰ 𝗧𝗶𝗺𝗲 𝗻𝗼𝘄: ${timeNow}
📆 𝗗𝗮𝘁𝗲 𝗻𝗼𝘄: ${dateNow}
━━━━━━━━━━━━━━━━━━━
ℹ️ | Transmission réussie par l'𝗔𝗗𝗠𝗜𝗡𝗕𝗢𝗧.`;

			// Envoi de la notification textuelle puis du fichier audio
			await message.reply(successReply);
			message.reply({ attachment: fs.createReadStream(filePath) });

			// Suppression du fichier temporaire après 5 secondes
			setTimeout(() => {
				if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
			}, 5000);

		} catch (err) {
			console.error(err);
			return message.reply("❌ *Malaxage de chakra échoué :* Impossible de convertir ce texte en message vocal.");
		}
	}
};
