// ==================== commands/getpfp.js ====================
import checkAdminOrOwner from '../system/checkAdmin.js';

export default {
  name: 'getpp',
  alias: ['pfp'],
  description: '📸 Retrieves the profile picture of a user (mention, reply, or number)',
  category: 'Owner',
  ownerOnly: true, // Only the owner can use it

  run: async (monarque, m, args) => {
    try {
      // ==================== TARGET ====================
      let target = null;

      // 1️⃣ Mention
      if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        target = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
      }
      // 2️⃣ Reply to a message
      else if (m.message?.extendedTextMessage?.contextInfo?.participant) {
        target = m.message.extendedTextMessage.contextInfo.participant;
      }
      // 3️⃣ Written number
      else if (args[0]) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      }

      if (!target) {
        return monarque.sendMessage(
          m.chat,
          { text: '❌ Mention a number, reply to a message, or type a number.' },
          { quoted: m }
        );
      }

      // ==================== RETRIEVE PHOTO ====================
      let pfpUrl;
      try {
        pfpUrl = await kaya.profilePictureUrl(target, 'image');
      } catch {
        return monarque.sendMessage(
          m.chat,
          { text: '❌ The user has no profile picture or it is private.' },
          { quoted: m }
        );
      }

      // ==================== SEND PHOTO ====================
      await monarque.sendMessage(
        m.chat,
        {
          image: { url: pfpUrl },
          caption: `📸 *PP*\n👤 @${target.split('@')[0]}`,
          mentions: [target]
        },
        { quoted: m }
      );

    } catch (err) {
      console.error('❌ getpp error:', err);
      await monarque.sendMessage(
        m.chat,
        { text: '❌ An error occurred.' },
        { quoted: m }
      );
    }
  }
};