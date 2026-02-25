import axios from 'axios';
import checkAdminOrOwner from '../system/checkAdmin.js';

export default {
  name: 'setgroup-pp',
  alias: ['setgrouppicture', 'setgp', 'setgpp'],
  category: 'Groupe',
  group: true,
  admin: true,
  botAdmin: true,
  ownerOnly: false,
  usage: '.setgroup-pp <image_url>',

  run: async (monarque, m, args) => {
    try {
      if (!m.isGroup) return;

      const chatId = m.chat;

      // 🔐 Check admin / owner
      const check = await checkAdminOrOwner(monarque, chatId, m.sender);
      if (!check.isAdminOrOwner) {
        return monarque.sendMessage(
          chatId,
          { text: '🚫 Admins or Owner only.' },
          { quoted: m }
        );
      }

      // ❌ No URL provided
      if (!args[0]) {
        return monarque.sendMessage(
          chatId,
          { text: '❌ Please provide a direct link to an image.' },
          { quoted: m }
        );
      }

      let buffer;

      // 🌐 Download image from URL
      try {
        const res = await axios.get(args[0], { responseType: 'arraybuffer' });
        buffer = Buffer.from(res.data);
      } catch {
        return monarque.sendMessage(
          chatId,
          { text: '❌ Invalid or inaccessible image link.' },
          { quoted: m }
        );
      }

      // ✅ Update group profile picture
      await monarque.updateProfilePicture(chatId, buffer);

      return monarque.sendMessage(
        chatId,
        { text: '✅ Group profile picture updated successfully.' },
        { quoted: m }
      );

    } catch (err) {
      console.error('[SETGROUP-PP] Error:', err);
      return monarque.sendMessage(
        m.chat,
        { text: '❌ Unable to change the group profile picture.' },
        { quoted: m }
      );
    }
  }
};