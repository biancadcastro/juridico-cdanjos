import { dbConnect } from "../lib/mongodb";
import { Cargo } from "../models/Cargo";

async function limparPermissoes() {
  try {
    await dbConnect();
    console.log("Conectado ao MongoDB");

    const result = await Cargo.updateMany(
      {},
      { $set: { permissoes: [] } }
    );

    console.log(`✓ Permissões removidas de ${result.modifiedCount} cargos`);
    console.log("\n✓ Limpeza de permissões concluída!");
  } catch (error) {
    console.error("Erro ao limpar permissões:", error);
  } finally {
    process.exit(0);
  }
}

limparPermissoes();
