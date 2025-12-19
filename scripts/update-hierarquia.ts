import { dbConnect } from "../lib/mongodb";
import { Cargo } from "../models/Cargo";

const hierarquias = {
  "Desembargadora": 1,
  "Juiz": 2,
  "Advogado": 3,
  "Secretário": 4,
  "Estagiário": 5
};

async function updateHierarquia() {
  try {
    await dbConnect();
    console.log("Conectado ao MongoDB");

    for (const [nome, hierarquia] of Object.entries(hierarquias)) {
      const result = await Cargo.updateOne(
        { nome },
        { $set: { hierarquia } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✓ Hierarquia do cargo '${nome}' atualizada para ${hierarquia}`);
      } else {
        console.log(`- Cargo '${nome}' não encontrado ou já possui hierarquia ${hierarquia}`);
      }
    }

    console.log("\n✓ Atualização de hierarquia concluída!");
  } catch (error) {
    console.error("Erro ao atualizar hierarquia:", error);
  } finally {
    process.exit(0);
  }
}

updateHierarquia();
