import express from "express";
import { createServer as createViteServer } from "vite";
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Telegram Bot Logic
  const token = process.env.TELEGRAM_BOT_TOKEN;
  let bot: TelegramBot | null = null;
  let botStatus = "Disconnected";
  let botUsername = "";

  if (token && token !== "YOUR_TELEGRAM_BOT_TOKEN") {
    try {
      bot = new TelegramBot(token, { polling: true });
      botStatus = "Connected";
      
      const me = await bot.getMe();
      botUsername = me.username || "Bot";
      console.log(`Bot started: @${botUsername}`);

      bot.onText(/\/start/, (msg) => {
        const chatId = msg.chat.id;
        bot?.sendMessage(
          chatId,
          "শিমুল ডাউনলোডার-এ আপনাকে স্বাগতম! 🎥\n\nআপনি এখান থেকে যেকোনো সোশ্যাল মিডিয়া ভিডিও বা অডিও খুব সহজে ডাউনলোড করতে পারবেন।\n\n✅ **যেভাবে ব্যবহার করবেন:**\nসরাসরি এখানে ভিডিওর লিঙ্কটি (Instagram, TikTok, YouTube, Facebook, Pinterest ইত্যাদি) পেস্ট করে পাঠিয়ে দিন।\n\nআমি আপনার ডাউনলোড ফাইলটি খুঁজে দেব! 🚀"
        );
      });

      bot.on("message", async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (!text || text.startsWith("/")) return;

        // Simple URL validation
        if (text.startsWith("http")) {
          const originalUrl = text.trim();
          console.log(`Processing URL: ${originalUrl}`);
          
          // Send processing message and capture it
          const statusMsg = await bot?.sendMessage(chatId, "🔍 আপনার লিঙ্কটি প্রসেস করছি... দয়া করে কিছুক্ষণ অপেক্ষা করুন।");
          
          try {
            const apiUrl = `https://allmedia-dl.vercel.app/download?url=${encodeURIComponent(originalUrl)}`;
            console.log(`Fetching from API: ${apiUrl}`);
            
            const response = await axios.get(apiUrl, { 
              timeout: 25000,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://allmedia-dl.vercel.app/',
                'Origin': 'https://allmedia-dl.vercel.app'
              }
            });
            
            const resData = response.data;
            console.log("API Response Body:", JSON.stringify(resData));

            // Recursive search function for any key that looks like a download URL
            const deepSearchForUrl = (obj: any): string => {
              if (!obj || typeof obj !== 'object') return "";
              const priorityKeys = ['url', 'link', 'download', 'media', 'mp4', 'src', 'video', 'video_url', 'audio', 'mp3'];
              for (const key of priorityKeys) {
                if (obj[key] && typeof obj[key] === 'string' && obj[key].startsWith('http')) return obj[key];
                if (obj[key] && Array.isArray(obj[key]) && obj[key].length > 0) {
                  const first = obj[key][0];
                  if (typeof first === 'string' && first.startsWith('http')) return first;
                  if (typeof first === 'object' && (first.url || first.link || first.download)) return first.url || first.link || first.download;
                }
              }
              for (const key in obj) {
                if (typeof obj[key] === 'string' && (obj[key].includes('.mp4') || obj[key].includes('.mp3') || obj[key].includes('video') || obj[key].includes('download')) && obj[key].startsWith('http')) return obj[key];
                if (typeof obj[key] === 'object') {
                  const result = deepSearchForUrl(obj[key]);
                  if (result) return result;
                }
              }
              return "";
            };

            const extractedUrl = deepSearchForUrl(resData);
            const metadata = resData.data || resData.result || resData;
            
            // Clean title logic
            const rawTitle = metadata.caption || metadata.description || metadata.title || "";
            const cleanTitle = (text: string): string => {
              if (!text) return "";
              return text
                .replace(/Instagram video downloader|Download Instagram video online|VideoFk|SnapTik|SaveFrom|online video downloader|✅| - |Media Download/gi, '')
                .trim();
            };

            const finalTitle = cleanTitle(rawTitle);
            const extractedThumb = metadata.thumbnail || metadata.image || metadata.thumb || metadata.cover || "";

            if (extractedUrl) {
              const caption = finalTitle ? `*${finalTitle.substring(0, 1000)}*` : "";
              
              try {
                await bot?.sendVideo(chatId, extractedUrl, {
                  caption: caption,
                  parse_mode: "Markdown"
                });
              } catch (videoError) {
                const linkMessage = `${caption}\n\n🔗 [সরাসরি ডাউনলোড লিঙ্ক](${extractedUrl})`;
                if (extractedThumb && typeof extractedThumb === 'string' && extractedThumb.startsWith('http')) {
                  await bot?.sendPhoto(chatId, extractedThumb, {
                    caption: linkMessage,
                    parse_mode: "Markdown",
                  }).catch(async () => {
                    await bot?.sendMessage(chatId, linkMessage, { parse_mode: "Markdown" });
                  });
                } else {
                  await bot?.sendMessage(chatId, linkMessage, { parse_mode: "Markdown" });
                }
              }
            } else {
              const errorDetail = resData.msg || resData.error || resData.message || (typeof resData === 'string' ? "Unexpected response" : "লিঙ্ক খুঁজে পাওয়া যায়নি");
              await bot?.sendMessage(chatId, `❌ দুঃখিত, মিডিয়াটি বের করা সম্ভব হয়নি।\n\nত্রুটি: ${errorDetail}\n\nদয়া করে লিঙ্কটি পাবলিক কিনা নিশ্চিত করুন।`);
            }
          } catch (error: any) {
            console.error("API Error Trace:", error.message);
            const status = error.response?.status;
            let errorMsg = error.response?.data?.msg || error.response?.data?.error || error.message;
            if (errorMsg === "Network Error") errorMsg = "সার্ভারের সাথে সংযোগ পাওয়া যাচ্ছে না";
            await bot?.sendMessage(chatId, `❌ সার্ভার এরর (${status || 'Network'}): ${errorMsg}\nদয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।`);
          } finally {
            if (statusMsg) {
              bot?.deleteMessage(chatId, statusMsg.message_id.toString()).catch(() => {});
            }
          }
        } else {
          bot?.sendMessage(chatId, "🤔 এটি সঠিক লিঙ্ক মনে হচ্ছে না।\n\nদয়া করে পূর্ণাঙ্গ লিঙ্কটি পাঠান (যেমন: http:// বা https:// দিয়ে শুরু)।");
        }
      });

      bot.on("polling_error", (error: any) => {
        if (error.message.includes("409 Conflict")) {
          console.error("Conflict Error: Another instance of this bot is already running elsewhere.");
          botStatus = "Error: Conflict (409). Check if your bot is running in another tab or hosting site.";
        } else {
          console.error("Polling error:", error.message);
          botStatus = "Error: " + error.message;
        }
      });

    } catch (err) {
      console.error("Bot failed to start:", err);
      botStatus = "Failed to start";
    }
  } else {
    console.warn("TELEGRAM_BOT_TOKEN not set.");
    botStatus = "Token Missing";
  }

  // API Routes
  app.get("/api/status", (req, res) => {
    res.json({
      status: botStatus,
      username: botUsername,
      configured: !!(token && token !== "YOUR_TELEGRAM_BOT_TOKEN")
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
