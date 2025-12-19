import { config } from "dotenv";
config({ path: ".env.local" });

import { dbConnect } from "../lib/mongodb";
import { User } from "../models/User";

async function registerBianca() {
  try {
    await dbConnect();
    console.log("Conectado ao MongoDB");

    const discordId = "1326277243403632763";
    
    // Verificar se já existe
    let user = await User.findOne({ discordId });
    
    if (user) {
      console.log("Usuário já existe! Atualizando...");
      user.name = "Bianca Saito";
      user.passaporte = "3298";
      user.registroCompleto = true;
      user.statusAprovacao = "aprovado";
      user.cargo = "Desembargadora";
      user.dataAprovacao = new Date();
      user.aprovadoPor = "Sistema";
      await user.save();
      console.log("Usuário atualizado com sucesso!");
    } else {
      console.log("Criando novo usuário...");
      user = await User.create({
        discordId: "1326277243403632763",
        name: "Bianca Saito",
        email: "bianca@cidadedosanjos.com",
        passaporte: "3298",
        username: "bianca",
        registroCompleto: true,
        statusAprovacao: "aprovado",
        cargo: "Desembargadora",
        dataAprovacao: new Date(),
        aprovadoPor: "Sistema",
        contratadoPor: "Fundadora"
      });
      console.log("Usuário criado com sucesso!");
    }

    console.log("\n=== Dados do Usuário ===");
    console.log("ID:", user._id);
    console.log("Discord ID:", user.discordId);
    console.log("Nome:", user.name);
    console.log("Passaporte:", user.passaporte);
    console.log("Cargo:", user.cargo);
    console.log("Status:", user.statusAprovacao);
    console.log("======================\n");

    process.exit(0);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    process.exit(1);
  }
}

registerBianca();
