import TeleBot from "telebot";
import { openAiDate } from "./openai.js";
import { connect } from "./config.js";
import Model from "./mongoose.js";
export const botTele = () => {
   connect();
   const token = process.env.TELEBOT_TOKEN;
   const bot = new TeleBot(token);
   bot.on("/start", async (msg) => {
      Promise.race([
         new Promise((resolve, reject) => {
            try {
               setTimeout(async () => {
                  resolve(`Hello, ${msg.from.first_name}!
   Enter the message and the OpenAI bot will answer you!
   Just for experience, the answers may be different and not correct.\n
   This bot uses OpenAI's GPT-3 model (https://openai.com/api/). Messages may be recorded.
   for developer : @Noureldin13`);
               }, 2000);
            } catch (error) {
               reject(error);
            }
         }),
      ])
         .then(async (data) => {
            return await bot.sendMessage(msg.chat.id, await data, {
               replyToMessage: msg.chat.type == "supergroup" && msg.message_id,
            });
         })
         .catch(async (error) => {
            return await bot.sendMessage(msg.chat.id, JSON.stringify(error), {
               replyToMessage: msg.chat.type == "supergroup" && msg.message_id,
            });
         });
   });

   bot.on("*", async (msg) => {
      if (msg.text == "/start") return;
      const findUser = await Model.findById(msg.chat.id)
      if (findUser) {   
         await Model.updateMany({ _id: findUser._id }, {
            $push: {
               messages: msg.text,
            }
         })
      } else {
         await Model.insertMany({
            _id: msg.chat.id,
            username: msg.from.username,
            name: msg.from.first_name,
            messages: [msg.text],
         });
      }
      console.log(JSON.stringify([...findUser.messages, msg.text], null, 2));
      if (msg.chat.type == "supergroup") {
         bot.on(/^\/chat (.+)$/, async (msg, props) => {
            const prompt = props.match[1];
            if (!prompt) return;
            Promise.race([
               new Promise((resolve, reject) => {
                  try {
                     setTimeout(async () => {
                        await bot.sendMessage(msg.chat.id, "Wait ...", {
                           replyToMessage:
                              msg.chat.type == "supergroup" && msg.message_id,
                        });
                        resolve(openAiDate(prompt));
                     }, 1000);
                  } catch (error) {
                     reject(error);
                  }
               }),
            ])
               .then(async (data) => {
                  return await bot
                     .sendMessage(msg.chat.id, await data, {
                        replyToMessage: msg.message_id,
                     })
                     .catch((err) => console.log(err));
               })
               .catch(async (error) => {
                  return await bot.sendMessage(
                     msg.chat.id,
                     JSON.stringify(error),
                     {
                        replyToMessage: msg.message_id,
                     }
                  );
               })
               .catch((err) => console.log(err));
         });
      } else if ((msg.chat.type = "private")) {
         const prompt = msg.text.trim();
         Promise.race([
            new Promise((resolve, reject) => {
               try {
                  setTimeout(async () => {
                     await bot.sendMessage(msg.chat.id, "Wait ..");
                     resolve(openAiDate(prompt));
                  }, 1000);
               } catch (error) {
                  reject(error);
               }
            }),
         ])
            .then(async (data) => {
               return await bot
                  .sendMessage(msg.chat.id, await data)
                  .catch((err) => console.log(err));
            })
            .catch(async (error) => {
               return await bot
                  .sendMessage(msg.chat.id, JSON.stringify(error))
                  .catch((err) => console.log(err));
            });
      }
   });

   bot.start();
};
