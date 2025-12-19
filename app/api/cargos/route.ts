import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { Cargo } from "@/models/Cargo";

// GET - Listar todos os cargos
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await dbConnect();
    const cargos = await Cargo.find({}).sort({ hierarquia: 1, nome: 1 });

    return NextResponse.json({ cargos }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar cargos:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST - Criar novo cargo
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { nome, descricao, cor, permissoes } = await req.json();

    if (!nome) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    await dbConnect();

    const cargoExistente = await Cargo.findOne({ nome });
    if (cargoExistente) {
      return NextResponse.json({ error: "Já existe um cargo com este nome" }, { status: 400 });
    }

    const cargo = await Cargo.create({
      nome,
      descricao,
      cor: cor || "#3b82f6",
      permissoes: permissoes || [],
      ativo: true,
    });

    return NextResponse.json({ cargo }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cargo:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// PUT - Atualizar cargo
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id, nome, descricao, cor, permissoes, ativo } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await dbConnect();

    const cargo = await Cargo.findById(id);
    if (!cargo) {
      return NextResponse.json({ error: "Cargo não encontrado" }, { status: 404 });
    }

    if (nome) cargo.nome = nome;
    if (descricao !== undefined) cargo.descricao = descricao;
    if (cor) cargo.cor = cor;
    if (permissoes) cargo.permissoes = permissoes;
    if (ativo !== undefined) cargo.ativo = ativo;

    await cargo.save();

    return NextResponse.json({ cargo }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar cargo:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETE - Deletar cargo
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await dbConnect();

    const cargo = await Cargo.findByIdAndDelete(id);
    if (!cargo) {
      return NextResponse.json({ error: "Cargo não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Cargo deletado com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar cargo:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
