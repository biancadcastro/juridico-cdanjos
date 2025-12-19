import { dbConnect } from "../lib/mongodb";
import { Cargo } from "../models/Cargo";

const cargosIniciais = [
  {
    nome: "Desembargadora",
    descricao: "Cargo de maior hierarquia com acesso total ao sistema",
    cor: "#8b5cf6",
    hierarquia: 1,
    permissoes: [],
    ativo: true
  },
  {
    nome: "Juiz",
    descricao: "Responsável por julgar processos e gerenciar audiências",
    cor: "#3b82f6",
    hierarquia: 2,
    permissoes: [],
    ativo: true
  },
  {
    nome: "Advogado",
    descricao: "Representa clientes e gerencia processos",
    cor: "#10b981",
    hierarquia: 3,
    permissoes: [],
    ativo: true
  },
  {
    nome: "Secretário",
    descricao: "Gerencia documentos e agendamentos",
    cor: "#f59e0b",
    hierarquia: 4,
    permissoes: [],
    ativo: true
  },
  {
    nome: "Estagiário",
    descricao: "Acesso limitado para aprendizado",
    cor: "#6b7280",
    hierarquia: 5,
    permissoes: [],
    ativo: true
  }
];

async function seedCargos() {
  try {
    await dbConnect();
    console.log("Conectado ao MongoDB");

    // Verificar se já existem cargos
    const cargosExistentes = await Cargo.find({});
    
    if (cargosExistentes.length > 0) {
      console.log(`${cargosExistentes.length} cargos já existem no banco de dados.`);
      console.log("Cargos existentes:", cargosExistentes.map(c => c.nome).join(", "));
      
      // Verificar se Desembargadora existe
      const desembargadora = cargosExistentes.find(c => c.nome === "Desembargadora");
      if (desembargadora) {
        console.log("✓ Cargo 'Desembargadora' já existe!");
        return;
      }
    }

    // Inserir apenas os cargos que não existem
    for (const cargoData of cargosIniciais) {
      const existe = await Cargo.findOne({ nome: cargoData.nome });
      
      if (!existe) {
        await Cargo.create(cargoData);
        console.log(`✓ Cargo '${cargoData.nome}' criado com sucesso!`);
      } else {
        console.log(`- Cargo '${cargoData.nome}' já existe, pulando...`);
      }
    }

    console.log("\n✓ Processo de seed concluído!");
  } catch (error) {
    console.error("Erro ao criar cargos:", error);
  } finally {
    process.exit(0);
  }
}

seedCargos();
