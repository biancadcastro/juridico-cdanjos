import { config } from "dotenv";
config({ path: ".env.local" });

import { dbConnect } from "../lib/mongodb";
import { User } from "../models/User";

async function checkUsers() {
  try {
    await dbConnect();
    console.log("Conectado ao MongoDB");

    const users = await User.find({});
    
    console.log(`\nTotal de usuários: ${users.length}\n`);
    
    users.forEach(user => {
      console.log("=".repeat(50));
      console.log("ID MongoDB:", user._id);
      console.log("Discord ID:", user.discordId);
      console.log("Nome:", user.name);
      console.log("Email:", user.email);
      console.log("Passaporte:", user.passaporte);
      console.log("Cargo:", user.cargo);
      console.log("Registro Completo:", user.registroCompleto);
      console.log("Status Aprovação:", user.statusAprovacao);
      console.log("=".repeat(50) + "\n");
    });

    process.exit(0);
  } catch (error) {
    console.error("Erro:", error);
    process.exit(1);
  }
}

checkUsers();
