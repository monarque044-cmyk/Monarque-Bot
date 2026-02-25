// ================= commands/repo.js =================

import { sendWithBotImage } from '../system/botAssets.js';
import { buildRepoMessage } from '../system/repoTemplate.js';

export default {
  name: 'repo',
  aliases: ['github', 'source'],
  description: 'Shows the bot GitHub repository',
  category: 'General',

  async execute(monarque, m) {
    await sendWithBotImage(
      monarque,
      m.chat,
      {
        caption: buildRepoMessage(),
        contextInfo: { mentionedJid: [m.sender] }
      },
      { quoted: m }
    );
  }
};