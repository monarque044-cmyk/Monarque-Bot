// ==================== commands/lock.js ====================
import checkAdminOrOwner from '../system/checkAdmin.js';

export default {
  name: 'mute',
  description: '🔒 Lock the group silently (admins only)',
  category: 'Groupe',
  group: true,
  admin: true,
  botAdmin: true,

  run: async (monarque, m) => {
    try {
      // 🔹 Check if user is admin or owner
      const permissions = await checkAdminOrOwner(monarque, m.chat, m.sender);
      if (!permissions.isAdminOrOwner) return;

      // 🔒 Lock group (only admins can talk)
      await monarque.groupSettingUpdate(m.chat, 'announcement');

      // ✅ SILENT MODE → NO MESSAGE SENT

    } catch (err) {
      console.error('❌ lock.js error:', err);

      // ❌ Only send message if there is an error
      await monarque.sendMessage(
        m.chat,
        { text: '❌ Failed to lock the group. Make sure I am admin.' },
        { quoted: m }
      );
    }
  }
};