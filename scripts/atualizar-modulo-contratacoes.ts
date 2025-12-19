import { dbConnect } from "../lib/mongodb";
import { Cargo } from "../models/Cargo";

async function atualizarNomeModulo() {
  try {
    await dbConnect();
    console.log("Conectado ao MongoDB");

    const result = await Cargo.updateMany(
      { "permissoes.modulo": "Aprovações" },
      { $set: { "permissoes.$[elem].modulo": "Contratações" } },
      { arrayFilters: [{ "elem.modulo": "Aprovações" }] }
    );

    console.log(`✓ Módulo atualizado em ${result.modifiedCount} cargos`);
    console.log("\n✓ Atualização concluída!");
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
  } finally {
    process.exit(0);
  }
}

atualizarNomeModulo();
