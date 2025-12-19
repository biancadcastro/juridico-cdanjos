import { dbConnect } from "../lib/mongodb";
import { Cargo } from "../models/Cargo";

const permissoesAprovacoes = {
  "Desembargadora": ["Visualizar", "Aprovar", "Recusar"],
  "Juiz": ["Visualizar", "Aprovar", "Recusar"]
};

async function adicionarPermissoesAprovacoes() {
  try {
    await dbConnect();
    console.log("Conectado ao MongoDB");

    for (const [nomeCargo, acoes] of Object.entries(permissoesAprovacoes)) {
      const cargo = await Cargo.findOne({ nome: nomeCargo });
      
      if (!cargo) {
        console.log(`- Cargo '${nomeCargo}' não encontrado, pulando...`);
        continue;
      }

      // Verificar se já existe permissão para Aprovações
      const permissaoExistente = cargo.permissoes.find((p: any) => p.modulo === "Aprovações");
      
      if (permissaoExistente) {
        console.log(`- Cargo '${nomeCargo}' já possui permissões para Aprovações, atualizando...`);
        permissaoExistente.acoes = acoes;
      } else {
        cargo.permissoes.push({
          modulo: "Aprovações",
          acoes: acoes
        });
      }

      await cargo.save();
      console.log(`✓ Permissões de Aprovações adicionadas ao cargo '${nomeCargo}': ${acoes.join(", ")}`);
    }

    console.log("\n✓ Permissões de Aprovações configuradas com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar permissões:", error);
  } finally {
    process.exit(0);
  }
}

adicionarPermissoesAprovacoes();
