import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // só se usar senha local
  image: { type: String },
  discordId: { type: String, unique: true, sparse: true },
  username: { type: String },
  discriminator: { type: String },
  passaporte: { type: String },
  contratadoPor: { type: String },
  cargo: { type: String },
  registroCompleto: { type: Boolean, default: false },
  statusAprovacao: { type: String, enum: ['pendente', 'aprovado', 'rejeitado'], default: 'pendente' },
  dataAprovacao: { type: Date },
  aprovadoPor: { type: String },
}, { timestamps: true, strict: false });

// Limpar cache do modelo se existir
if (models.User) {
  delete models.User;
}

export const User = model("User", UserSchema);
