import mongoose, { Schema, models, model } from "mongoose";

const AndamentoSchema = new Schema({
  data: { type: Date, default: Date.now },
  descricao: { type: String, required: true },
  responsavel: { type: String, required: true }
}, { _id: false });

const ProcessoSchema = new Schema({
  numeroProcesso: { type: String, required: true, unique: true },
  tipo: { 
    type: String, 
    enum: ['Certidão de Casamento'],
    default: 'Certidão de Casamento'
  },
  titulo: { type: String, required: true },
  descricao: { type: String },
  cliente: { type: String, required: true },
  partes: [{ type: String }], // Nomes dos envolvidos
  responsavel: { type: String, required: true }, // Email do responsável
  status: { 
    type: String, 
    enum: ['ativo', 'aguardando', 'arquivado', 'finalizado'], 
    default: 'ativo' 
  },
  prioridade: {
    type: String,
    enum: ['baixa', 'media', 'alta', 'urgente'],
    default: 'media'
  },
  
  // Campos específicos para cartórios
  cartorio: { type: String },
  livro: { type: String },
  folha: { type: String },
  termo: { type: String },
  dataRegistro: { type: Date },
  cidadeUF: { type: String },
  
  // Controle de andamento
  andamentos: [AndamentoSchema],
  prazoVencimento: { type: Date },
  valorCausa: { type: Number },
  
  // Organização
  tags: [{ type: String }],
  observacoes: { type: String },
  documentos: [{ type: String }], // URLs dos documentos
  
  dataAbertura: { type: Date, default: Date.now },
  dataAtualizacao: { type: Date, default: Date.now }
}, { timestamps: true });

// Índices para melhorar performance
ProcessoSchema.index({ numeroProcesso: 1 });
ProcessoSchema.index({ status: 1 });
ProcessoSchema.index({ tipo: 1 });
ProcessoSchema.index({ responsavel: 1 });
ProcessoSchema.index({ tags: 1 });
ProcessoSchema.index({ prioridade: 1 });

// Limpar cache do modelo se existir
if (models.Processo) {
  delete models.Processo;
}

export const Processo = model("Processo", ProcessoSchema);
