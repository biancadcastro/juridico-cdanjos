import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autenticado", registroCompleto: false },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado", registroCompleto: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        registroCompleto: user.registroCompleto || false,
        statusAprovacao: user.statusAprovacao || 'pendente',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          passaporte: user.passaporte,
          contratadoPor: user.contratadoPor,
          cargo: user.cargo,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao verificar registro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", registroCompleto: false },
      { status: 500 }
    );
  }
}
