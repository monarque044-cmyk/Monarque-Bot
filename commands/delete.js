import checkAdminOrOwner from '../system/checkAdmin.js';

export default {
  name: 'del',
  alias: ['delete', 'rm'],
  description: 'Delete messages',
  category: 'Groupe',
  group: true,
  admin: true,

  run: async (monarque, m, args) => {
    try {
      const chatId = m.chat;

      if (!m.isGroup)
        return monarque.sendMessage(chatId, { text: '❌ Groupe uniquement.' }, { quoted: m });

      const check = await checkAdminOrOwner(monarque, chatId, m.sender);
      if (!check.isAdmin && !check.isOwner)
        return monarque.sendMessage(chatId, { text: '🚫 Admin seulement.' }, { quoted: m });

      // ===== CAS REPLY =====
      const ctx = m.message?.extendedTextMessage?.contextInfo;
      if (ctx?.stanzaId) {
        await monarque.sendMessage(chatId, {
          delete: {
            remoteJid: chatId,
            fromMe: false,
            id: ctx.stanzaId,
            participant: ctx.participant
          }
        }).catch(console.error);
        return;
      }

      // ===== CAS SIMPLE =====
      await monarque.sendMessage(chatId, { delete: m.key }).catch(() => {});

    } catch (err) {
      console.error('[DEL ERROR]', err);
    }
  }
};