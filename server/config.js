import mongoose from "mongoose";
console.log(process.env.MONGODB_URL);
export const connect = async (_) => {
   await mongoose
      .connect(
         process.env.MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
         }
      )
      .then(() => console.log("Connected!"))
      .catch((err) => console.log(err));
   mongoose.set("strictQuery", true);
};
