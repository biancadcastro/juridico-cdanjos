import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { nome, passaporte, contratadoPor } = await req.json();

    if (!nome || !passaporte || !contratadoPor) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    user.name = nome;
    user.passaporte = passaporte;
    user.contratadoPor = contratadoPor;
    user.registroCompleto = true;
    user.statusAprovacao = 'pendente';
    await user.save();

    return NextResponse.json(
      { 
        message: "Registro completado com sucesso",
        user: {
          id: user._id,
          name: user.name,
          passaporte: user.passaporte,
          contratadoPor: user.contratadoPor,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao completar registro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
