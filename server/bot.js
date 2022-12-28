import TeleBot from "telebot";
import { openAiDate } from "./openai.js";
import { connect } from "./config.js";
import Model from "./mongoose.js";
export const botTele = async () => {
   connect();
   const token = process.env.TELEBOT_TOKEN;
   const bot = new TeleBot(token);
   await bot.on("/start", async (msg) => {
      new Promise(async (_) => {
         try {
            bot.sendMessage(
               msg.chat.id,
               `Hello, ${msg.from.first_name}!
Enter the message and the OpenAI bot will answer you!
Just for experience, the answers may be different and not correct.\n
This bot uses OpenAI's GPT-3 model (https://openai.com/api/). Messages may be recorded.
for developer : @Noureldin13`,
               {
                  replyToMessage: msg.message_id,
               }
            );
         } catch (error) {
            bot.sendMessage(msg.chat.id, JSON.stringify(error), {
               replyToMessage: msg.message_id,
            });
         }
      });
   });

   await bot.on("text", async (msg) => {
      if (msg.text == "/start") return;
      const findUser = await Model.findById(msg.chat.id);
      if (findUser) {
         await Model.updateMany(
            { _id: findUser._id },
            {
               $push: {
                  messages: msg.text,
               },
            }
         );
      } else {
         await Model.insertMany({
            _id: msg.chat.id,
            username: msg.from.username,
            name: msg.from.first_name,
            messages: [msg.text],
         });
      }
      if (msg.chat.type === "private") {
         const prompt = msg.text.trim();
         new Promise(async (_) => {
            try {
               bot.sendMessage(msg.chat.id, "Wait ..", {
                  replyToMessage: msg.message_id,
               });
               bot.sendMessage(msg.chat.id, await openAiDate(prompt), {
                  replyToMessage: msg.message_id,
               });
            } catch (error) {
               bot.sendMessage(msg.chat.id, JSON.stringify(error), {
                  replyToMessage: msg.message_id,
               });
            }
         });
      }
   });
   await bot.on(/^\/chat (.+)$/, async (msg, props) => {
      const prompt = msg.text.replace(/\/chat/i, "").trim();
      if (!prompt) return;
      new Promise(async (_) => {
         try {
            bot.sendMessage(msg.chat.id, "Wait ..", {
               replyToMessage: msg.message_id,
            });
            bot.sendMessage(msg.chat.id, await openAiDate(prompt), {
               replyToMessage: msg.message_id,
            });
         } catch (error) {
            bot.sendMessage(msg.chat.id, JSON.stringify(error), {
               replyToMessage: msg.message_id,
            });
         }
      });
   });

   await bot.start();
};
