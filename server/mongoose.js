import mongoose from "mongoose";


const Schema = mongoose.Schema(
   {
      _id: {
         type: String,
         default: Math.floor(Math.random() * 1000000 + 1),
      },
      username: {
         type: String,
      },
      name: {
         type: String,
      },
      messages: {
         type: Array,
         default: [],
         
      },
   },
   {
      timestamps: true,
   }
);

const Model = mongoose.model("User", Schema);

export default Model;
