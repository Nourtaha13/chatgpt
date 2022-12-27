import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { botTele } from "./bot.js";
import { openAiDate } from "./openai.js";
dotenv.config();
const PORT = process.env.PORT_SERVER || 5000;
botTele();

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
      const prompt = await req.body.prompt;
      res.status(200).json({
         bot: await openAiDate(prompt),
      });
   } catch (error) {
      return res.status(500).json({ message: error.message });
   }
});

app.listen(PORT, () =>
   console.log(`Server is running on http://localhost:${PORT}`)
);
