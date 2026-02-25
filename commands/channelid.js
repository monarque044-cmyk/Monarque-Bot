// ================= commands/channelid.js =================
import { contextInfo } from '../system/contextInfo.js';

export default {
  name: 'channelid',
  description: 'Get WhatsApp Channel ID from channel link',
  category: 'Groupe',

  async execute(monarque, m, args) {
    try {
      // ❌ No link provided
      if (!args[0]) {
        return monarque.sendMessage(
          m.chat,
          {
            text:
              '❌ Usage:\n.channelid https://whatsapp.com/channel/XXXX',
            contextInfo
          },
          { quoted: m }
        );
      }

      // 🔎 Extract channel invite code
      const match = args[0].match(/channel\/([A-Za-z0-9]+)/);
      if (!match) {
        return monarque.sendMessage(
          m.chat,
          {
            text: '❌ Invalid WhatsApp Channel link.',
            contextInfo
          },
          { quoted: m }
        );
      }

      const inviteCode = match[1];

      // 📡 Fetch channel metadata
      const info = await monarque.newsletterMetadata('invite', inviteCode);

      if (!info?.id) {
        return monarque.sendMessage(
          m.chat,
          {
            text: '❌ Unable to fetch Channel ID.',
            contextInfo
          },
          { quoted: m }
        );
      }

      // ✅ Send Channel ID
      await monarque.sendMessage(
        m.chat,
        {
          text: `✅ *WhatsApp Channel ID*\n\n${info.id}@newsletter`,
          contextInfo
        },
        { quoted: m }
      );

    } catch (err) {
      console.error('❌ CHANNELID ERROR:', err);
      await monarque.sendMessage(
        m.chat,
        {
          text: '❌ Error while retrieving Channel ID.',
          contextInfo
        },
        { quoted: m }
      );
    }
  }
};