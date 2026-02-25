import checkAdminOrOwner from "../system/checkAdmin.js";

export default {
  name: "setgdesc",
  alias: ["gdesc", "setgroupdesc"],
  category: "Groupe",
  description: "Change the group description",
  group: true,
  admin: true,
  botAdmin: true,
  ownerOnly: false,
  usage: ".setgdesc <new description>",

  run: async (monarque, m, args) => {
    try {
      if (!m.isGroup) return;

      const chatId = m.chat;
      const senderId = m.sender;

      // 🔐 Check admin / owner
      const check = await checkAdminOrOwner(monarque, chatId, senderId);
      if (!check.isAdminOrOwner) {
        return monarque.sendMessage(chatId, { text: "🚫 Admins or Owner only." }, { quoted: m });
      }

      const newDesc = (args.join(" ") || "").trim();
      if (!newDesc) {
        return monarque.sendMessage(chatId, { text: "❌ Usage: .setgdesc <new description>" }, { quoted: m });
      }

      await monarque.groupUpdateDescription(chatId, newDesc);

      return monarque.sendMessage(chatId, { text: "✅ Group description updated successfully!" }, { quoted: m });

    } catch (err) {
      console.error("[SETGDESC] Error:", err);
      return monarque.sendMessage(chatId, { text: "❌ Unable to change the group description." }, { quoted: m });
    }
  }
};