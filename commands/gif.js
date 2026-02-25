import axios from 'axios';

export default {
  name: 'gif',
  alias: ['giphy'],
  description: 'Search and send a GIF from Giphy',
  category: 'Fun',
  usage: '.gif <mot>',

  run: async (monarque, m, args) => {
    const chatId = m.chat;
    const query = args.join(' ').trim();
    const apiKey = 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq';

    if (!query)
      return monarque.sendMessage(chatId, { text: '❌ Donne un mot-clé.' }, { quoted: m });

    try {
      const { data } = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
          api_key: apiKey,
          q: query,
          limit: 1,
          rating: 'g'
        }
      });

      const gif = data.data[0];

      if (!gif) {
        return monarque.sendMessage(chatId, { text: '⚠️ Aucun GIF trouvé.' }, { quoted: m });
      }

      const mp4Url = gif.images.original_mp4.mp4;

      await monarque.sendMessage(chatId, {
        video: { url: mp4Url },
        gifPlayback: true,
        caption: `🎬 GIF: ${query}`
      }, { quoted: m });

    } catch (err) {
      console.error('[GIF ERROR]', err);
      return monarque.sendMessage(chatId, { text: '❌ Erreur GIF.' }, { quoted: m });
    }
  }
};