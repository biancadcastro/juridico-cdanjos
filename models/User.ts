import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // só se usar senha local
  image: { type: String },
  discordId: { type: String },
}, { timestamps: true });

export const User = models.User || model("User", UserSchema);
