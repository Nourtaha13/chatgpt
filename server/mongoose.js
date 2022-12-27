import mongoose from "mongoose";


const Schema = mongoose.Schema(
   {
      _id: {
         type: String,
         default: Math.floor(Math.random() * 1000000 + 1),
      },
      username: {
         type: String,
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
      messages: {
         type: Array,
         default: [],
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

const Model = mongoose.model("User", Schema);

export default Model;
