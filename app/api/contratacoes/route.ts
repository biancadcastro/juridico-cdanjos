import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Cargo } from "@/models/Cargo";

// GET - Listar usuários pendentes de aprovação
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await dbConnect();

    // Buscar usuários com status pendente
    const usuarios = await User.find({ 
      statusAprovacao: "pendente",
      registroCompleto: true 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ usuarios }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar usuários pendentes:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST - Aprovar ou recusar usuário
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { userId, acao } = await req.json();

    if (!userId || !acao) {
      return NextResponse.json({ error: "userId e acao são obrigatórios" }, { status: 400 });
    }

    if (acao !== "aprovar" && acao !== "recusar") {
      return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }

    await dbConnect();

    const usuario = await User.findById(userId);
    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Se for aprovação, buscar o cargo mais baixo da hierarquia
    if (acao === "aprovar") {
      // Buscar o cargo com a maior hierarquia (hierarquia mais baixa)
      const cargoMaisBaixo = await Cargo.findOne().sort({ hierarquia: -1 }).limit(1);
      
      if (cargoMaisBaixo) {
        usuario.cargo = cargoMaisBaixo.nome;
      }
    }

    // Atualizar status
    usuario.statusAprovacao = acao === "aprovar" ? "aprovado" : "rejeitado";
    usuario.dataAprovacao = new Date();
    usuario.aprovadoPor = session.user?.id;

    await usuario.save();

    return NextResponse.json({ 
      message: acao === "aprovar" ? "Usuário aprovado com sucesso" : "Usuário recusado",
      usuario 
    }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar aprovação:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
