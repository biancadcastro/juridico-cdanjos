import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import ServicoValor from "@/models/Servico";
import { readFileSync } from "fs";
import { join } from "path";

// PATCH - Atualizar apenas o valor do serviço
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const body = await req.json();
    const { valor } = body;

    if (valor === undefined || valor < 0) {
      return NextResponse.json(
        { error: "Valor inválido" },
        { status: 400 }
      );
    }

    // Ler serviços do JSON
    const servicosPath = join(process.cwd(), "data", "servicos.json");
    const servicosData = JSON.parse(readFileSync(servicosPath, "utf-8"));

    // Verificar se o serviço existe no JSON
    const servicoBase = servicosData.find((s: any) => s.id === id);
    if (!servicoBase) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    // Salvar/atualizar valor customizado
    const servicoValor = await ServicoValor.findOneAndUpdate(
      { servicoId: id },
      { valorCustomizado: valor },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      ...servicoBase,
      valor,
      valorCustomizado: true,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar serviço" },
      { status: 500 }
    );
  }
}

// DELETE - Resetar valor para o padrão
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;

    // Ler serviços do JSON
    const servicosPath = join(process.cwd(), "data", "servicos.json");
    const servicosData = JSON.parse(readFileSync(servicosPath, "utf-8"));

    // Verificar se o serviço existe no JSON
    const servicoBase = servicosData.find((s: any) => s.id === id);
    if (!servicoBase) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    // Remover valor customizado (volta ao padrão)
    await ServicoValor.findOneAndDelete({ servicoId: id });

    return NextResponse.json({
      ...servicoBase,
      valor: servicoBase.valorPadrao,
      valorCustomizado: false,
    });
  } catch (error: any) {
    console.error("Erro ao resetar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao resetar serviço" },
      { status: 500 }
    );
  }
}
