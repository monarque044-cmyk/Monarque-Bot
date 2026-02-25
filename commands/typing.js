import { saveBotModes } from '../system/botStatus.js';
import { contextInfo } from '../system/contextInfo.js';

export default {
  name: 'typing',
  description: 'Enable or disable automatic typing mode',
  category: 'Owner',
  ownerOnly: true, // ✅ handled by the handler

  run: async (monarque, m, args) => {
    try {
      const action = args[0]?.toLowerCase();
      if (!['on', 'off', 'status'].includes(action)) {
        return monarque.sendMessage(
          m.chat,
          { text: '❌ Usage: .typing on|off|status', contextInfo },
          { quoted: m }
        );
      }

      // Initialize botModes if needed
      global.botModes = global.botModes || {};
      global.botModes.typing = global.botModes.typing || false;

      if (action === 'on') {
        global.botModes.typing = true;
        saveBotModes(global.botModes);

        // Trigger immediately to confirm
        await monarque.sendPresenceUpdate('composing', m.chat);
        setTimeout(() => monarque.sendPresenceUpdate('paused', m.chat), 2000);

        return kaya.sendMessage(
          m.chat,
          {
            text: '✅ "Typing" mode enabled.\n\nThe bot will show the "typing" indicator.',
            contextInfo
          },
          { quoted: m }
        );
      }

      if (action === 'off') {
        global.botModes.typing = false;
        saveBotModes(global.botModes);

        // Stop immediately
        await monarque.sendPresenceUpdate('paused', m.chat);

        return monarque.sendMessage(
          m.chat,
          { text: '❌ "Typing" mode disabled.', contextInfo },
          { quoted: m }
        );
      }

      if (action === 'status') {
        const isActive = global.botModes.typing;
        return monarque.sendMessage(
          m.chat,
          { text: `📊 Typing mode: ${isActive ? '✅ ENABLED' : '❌ DISABLED'}`, contextInfo },
          { quoted: m }
        );
      }

    } catch (err) {
      console.error('❌ typing.js error:', err);
      return monarque.sendMessage(
        m.chat,
        { text: '❌ An error occurred.', contextInfo },
        { quoted: m }
      );
    }
  }
};