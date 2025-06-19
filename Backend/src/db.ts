import mongoose, { model, Schema } from "mongoose";
import { MONGODB_URI } from "./config";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Crash on failure
  });

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true } // typo fix: `require` → `required`
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
  title: String,
  Link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }],
  userId: [{
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  }],
});
export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
});
export const LinkModel = model("Links", LinkSchema);
