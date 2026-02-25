// ==================== commands/unlock.js ====================
import checkAdminOrOwner from '../system/checkAdmin.js'; 
import { contextInfo } from '../system/contextInfo.js';

export default {
  name: 'unlock',
  description: '🔓 Unlock the group (everyone can send messages)',
  category: 'Groupe',
  group: true,
  admin: true,
  botAdmin: true,

  run: async (monarque, m, msg, store, args) => {
    try {
      // 🔹 Check if user is admin / owner
      const permissions = await checkAdminOrOwner(monarque, m.chat, m.sender);
      if (!permissions.isAdminOrOwner) {
        return monarque.sendMessage(
          m.chat,
          { text: '🚫 Access denied: Only admins or owners can use this command.', contextInfo },
          { quoted: m }
        );
      }

      // 🔹 Unlock the group (everyone can send messages)
      await monarque.groupSettingUpdate(m.chat, 'not_announcement');

      const text = `
╭━━〔🔓 GROUP UNLOCKED〕━━⬣
┃ ✨ *Members* can send messages again.
┃ 📌 Remember to lock it again if needed with *.lock*
╰━━━━━━━━━━━━━━━━━━━━⬣
      `.trim();

      await monarque.sendMessage(
        m.chat,
        { text, mentions: [m.sender], contextInfo },
        { quoted: m }
      );

    } catch (err) {
      console.error('❌ unlock.js error:', err);
      await monarque.sendMessage(
        m.chat,
        { text: '❌ Unable to unlock the group. Make sure I am admin.', contextInfo },
        { quoted: m }
      );
    }
  }
};