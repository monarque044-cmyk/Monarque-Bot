// ================= commands/info.js =================

import { sendWithBotImage } from '../system/botAssets.js';
import { BOT_OWNER_INFO } from '../system/botInfo.js';

export default {
  name: 'owner',
  aliases: ['dev', 'creator'],
  description: 'Shows information about the bot developer',
  category: 'General',

  async execute(monarque, m) {
    await sendWithBotImage(
      monarque,
      m.chat,
      {
        caption: BOT_OWNER_INFO,
        contextInfo: { mentionedJid: [m.sender] },
      },
      { quoted: m }
    );
  },
};