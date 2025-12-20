import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import ServicoValor from "@/models/Servico";
import { readFileSync } from "fs";
import { join } from "path";

// GET - Listar todos os serviços (JSON + valores customizados)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Ler serviços do JSON
    const servicosPath = join(process.cwd(), "data", "servicos.json");
    const servicosData = JSON.parse(readFileSync(servicosPath, "utf-8"));

    // Buscar valores customizados do banco
    const valoresCustomizados = await ServicoValor.find();
    const valoresMap = new Map(
      valoresCustomizados.map((v) => [v.servicoId, v.valorCustomizado])
    );

    // Merge: serviços do JSON + valores customizados
    const servicos = servicosData.map((servico: any) => ({
      ...servico,
      valor: valoresMap.get(servico.id) ?? servico.valorPadrao,
      valorCustomizado: valoresMap.has(servico.id),
    }));

    return NextResponse.json(servicos);
  } catch (error: any) {
    console.error("Erro ao buscar serviços:", error);
    return NextResponse.json(
      { error: "Erro ao buscar serviços" },
      { status: 500 }
    );
  }
}
