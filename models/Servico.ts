import mongoose, { Schema, models } from "mongoose";

// Schema para armazenar apenas valores customizados dos serviços
const ServicoValorSchema = new Schema(
  {
    servicoId: {
      type: String,
      required: true,
      unique: true,
    },
    valorCustomizado: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ServicoValor = models.ServicoValor || mongoose.model("ServicoValor", ServicoValorSchema);

export default ServicoValor;
