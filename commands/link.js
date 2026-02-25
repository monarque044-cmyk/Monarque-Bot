import checkAdminOrOwner from '../system/checkAdmin.js';
import decodeJid from '../system/decodeJid.js';
import { BOT_NAME } from '../system/botAssets.js';

export default {
  name: 'link',
  alias: ['grouplink', 'invite'],
  category: 'Groupe',
  group: true,
  admin: true,
  botAdmin: true,
  ownerOnly: false,
  usage: '.link',

  run: async (monarque, m, args) => {
    try {
      if (!m.isGroup) return;

      const chatId = decodeJid(m.chat);
      const sender = decodeJid(m.sender);

      // 🔐 Vérification admin / owner
      const check = await checkAdminOrOwner(monarque, chatId, sender);
      if (!check.isAdminOrOwner) {
        return monarque.sendMessage(
          chatId,
          { text: `🚫 Only *Admins* or the *Bot Owner* can use this command.` },
          { quoted: m }
        );
      }

      // 🔗 Récupération du lien du groupe
      const code = await monarque.groupInviteCode(chatId);
      if (!code) {
        return monarque.sendMessage(
          chatId,
          { text: '❌ Unable to retrieve the group link.' },
          { quoted: m }
        );
      }
      const inviteLink = `https://chat.whatsapp.com/${code}`;

      // 📸 Récupération de la photo du groupe
      let groupImage = null;
      try {
        groupImage = await monarque.profilePictureUrl(chatId, 'image');
      } catch {
        groupImage = null; // pas de photo
      }

      // 🔹 Envoi du lien avec image si dispo
      if (groupImage) {
        return monarque.sendMessage(
          chatId,
          {
            image: { url: groupImage },
            caption: `🔗 *Group Link* :\n${inviteLink}\n\nby ${BOT_NAME}`
          },
          { quoted: m }
        );
      } else {
        return monarque.sendMessage(
          chatId,
          { text: `🔗 *Group Link* :\n${inviteLink}\n\nby ${BOT_NAME}` },
          { quoted: m }
        );
      }

    } catch (err) {
      console.error('[LINK] Error:', err);
      return monarque.sendMessage(
        m.chat,
        { text: '❌ An error occurred while retrieving the group link.' },
        { quoted: m }
      );
    }
  }
};