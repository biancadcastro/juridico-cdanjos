import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Cargo } from "@/models/Cargo";

export async function GET() {
  try {
    await dbConnect();

    // Buscar todos os usuários aprovados e ativos com .lean() para performance
    const usuarios = await User.find({ 
      statusAprovacao: "aprovado",
      ativo: { $ne: false }
    })
    .select("name email cargo passaporte contratadoPor createdAt statusAprovacao fotoOAB numeroOAB")
    .lean()
    .exec();

    // Buscar todos os cargos para obter hierarquia
    const cargos = await Cargo.find({}).select("nome hierarquia").lean().exec();
    
    // Criar mapa de hierarquia por cargo
    const hierarquiaPorCargo = new Map();
    cargos.forEach(cargo => {
      hierarquiaPorCargo.set(cargo.nome, cargo.hierarquia || 99);
    });

    // Adicionar hierarquia aos usuários e ordenar
    const membros = usuarios.map(usuario => ({
      _id: usuario._id,
      name: usuario.name,
      email: usuario.email,
      cargo: usuario.cargo,
      passaporte: usuario.passaporte,
      contratadoPor: usuario.contratadoPor,
      image: null, // Não usar imagem do Discord
      createdAt: usuario.createdAt,
      statusAprovacao: usuario.statusAprovacao,
      fotoOAB: usuario.fotoOAB,
      numeroOAB: usuario.numeroOAB,
      hierarquia: hierarquiaPorCargo.get(usuario.cargo) || 99
    })).sort((a, b) => a.hierarquia - b.hierarquia);

    return NextResponse.json({ membros }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error("Erro ao listar membros:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
