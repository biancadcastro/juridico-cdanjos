import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Cargo } from "@/models/Cargo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Função auxiliar para verificar permissões
async function verificarPermissao(session: any, moduloNome: string, acaoNome: string) {
  await dbConnect();
  
  const usuario = await User.findOne({ email: session.user.email });
  if (!usuario || !usuario.cargo) {
    return false;
  }
  
  const cargo = await Cargo.findOne({ nome: usuario.cargo });
  if (!cargo) {
    return false;
  }
  
  const modulo = cargo.permissoes.find((p: any) => p.modulo === moduloNome);
  if (!modulo) {
    return false;
  }
  
  return modulo.acoes.includes(acaoNome);
}

// PATCH - Atualizar cargo do funcionário
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Verificar permissão
    const temPermissao = await verificarPermissao(session, "Funcionários", "Editar Cargo");
    if (!temPermissao) {
      return NextResponse.json({ error: "Sem permissão para editar cargos" }, { status: 403 });
    }

    await dbConnect();

    const { id } = params;
    const { cargo } = await request.json();

    if (!cargo) {
      return NextResponse.json({ error: "Cargo é obrigatório" }, { status: 400 });
    }

    // Atualizar o cargo do usuário
    const usuario = await User.findByIdAndUpdate(
      id,
      { cargo },
      { new: true }
    );

    if (!usuario) {
      return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Cargo atualizado com sucesso",
      usuario 
    }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar cargo:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETE - Demitir funcionário (desativar)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Verificar permissão
    const temPermissao = await verificarPermissao(session, "Funcionários", "Demitir");
    if (!temPermissao) {
      return NextResponse.json({ error: "Sem permissão para demitir funcionários" }, { status: 403 });
    }

    await dbConnect();

    const { id } = params;

    // Atualizar o status de aprovação para "rejeitado" ou adicionar um campo "ativo: false"
    const usuario = await User.findByIdAndUpdate(
      id,
      { 
        statusAprovacao: "rejeitado",
        ativo: false 
      },
      { new: true }
    );

    if (!usuario) {
      return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Funcionário demitido com sucesso" 
    }, { status: 200 });
  } catch (error) {
    console.error("Erro ao demitir funcionário:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
