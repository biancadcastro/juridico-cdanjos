import mongoose, { Schema, models, model } from "mongoose";

const CargoSchema = new Schema({
  nome: { type: String, required: true, unique: true },
  descricao: { type: String },
  cor: { type: String, default: "#3b82f6" }, // Cor para identificação visual
  hierarquia: { type: Number, default: 99 }, // Ordem hierárquica (menor = maior hierarquia)
  permissoes: [{
    modulo: { type: String, required: true }, // Ex: processos, clientes, usuarios
    acoes: [{ type: String }] // Ex: criar, editar, visualizar, deletar
  }],
  ativo: { type: Boolean, default: true },
}, { timestamps: true });

// Limpar cache do modelo se existir
if (models.Cargo) {
  delete models.Cargo;
}

export const Cargo = model("Cargo", CargoSchema);
