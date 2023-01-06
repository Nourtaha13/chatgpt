import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { botTele } from "./bot.js";
import { openAiDate } from "./openai.js";
import { connect } from "./config.js";
dotenv.config();
const PORT = process.env.PORT_SERVER || 5000;
botTele();
connect()
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
   res.status(200).json({
      message: "Hello from Chat gpt",
   });
});

app.post("/", async (req, res) => {
   try {
       const find = await ViewsModel.findOne({ page: "home" });
      if (find.length === 0) {
         await ViewsModel({
            page: "home",
            views: 1,
         }).save();
      }
      await ViewsModel.updateMany(
         { page: "home" },
         { $set: { views: find.views + 1 } }
      );
      const prompt = await req.body.prompt;
      return res.status(200).json({
         bot: await openAiDate(prompt),
         views: find.views,
      });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
});

app.listen(PORT, () =>
   console.log(`Server is running on http://localhost:${PORT}`)
);
