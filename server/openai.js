import { Configuration, OpenAIApi } from "openai";

export const openAiDate = async (prompt) => {
   const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
   });
   try {
      const openai = new OpenAIApi(configuration);
      const response = await openai.createCompletion({
         model: "text-davinci-003",
         prompt: `${prompt}`,
         temperature: 0,
         max_tokens: 3000,
         top_p: 1,
         frequency_penalty: 0.5,
         presence_penalty: 0.0,
      });
      return await response.data.choices[0].text
      
   } catch (error) {
      console.log(error)
   }
};
