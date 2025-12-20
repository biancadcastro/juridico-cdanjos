import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Processo } from "@/models/Processo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Listar todos os processos
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await dbConnect();

    const processos = await Processo.find({})
      .sort({ dataAtualizacao: -1 })
      .lean()
      .exec();

    return NextResponse.json({ processos }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error("Erro ao listar processos:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST - Criar novo processo
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { 
      tipo, titulo, descricao, cliente, partes, status, prioridade,
      prazoVencimento, valorCausa, tags, observacoes
    } = body;

    // Validações
    if (!titulo || !cliente) {
      return NextResponse.json(
        { error: "Campos obrigatórios: titulo e cliente" },
        { status: 400 }
      );
    }

    // Gerar número único do processo no formato XXXXXXXX-XX
    let numeroProcesso = "";
    let tentativas = 0;
    let processoExistente = null;
    
    do {
      const parte1 = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      const parte2 = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      numeroProcesso = `${parte1}-${parte2}`;
      
      processoExistente = await Processo.findOne({ numeroProcesso });
      tentativas++;
      
      if (tentativas > 10) {
        return NextResponse.json(
          { error: "Erro ao gerar número único do processo" },
          { status: 500 }
        );
      }
    } while (processoExistente);

    // Gerar dados aleatórios do cartório
    const livro = Math.floor(Math.random() * 999) + 1; // 1-999
    const folha = Math.floor(Math.random() * 500) + 1; // 1-500
    const termo = Math.floor(Math.random() * 9999) + 1; // 1-9999
    const dataRegistro = new Date();

    // Criar processo com dados fixos do cartório
    const novoProcesso = await Processo.create({
      numeroProcesso,
      tipo: "Certidão de Casamento",
      titulo,
      descricao: descricao || "",
      cliente,
      partes: partes || [],
      responsavel: session.user?.name || session.user?.email || "",
      status: status || "ativo",
      prioridade: prioridade || "media",
      cartorio: "1° Tabelião Angelical",
      cidadeUF: "Cidade dos Anjos",
      livro: livro.toString(),
      folha: folha.toString(),
      termo: termo.toString(),
      dataRegistro,
      andamentos: [{
        data: new Date(),
        descricao: "Processo criado",
        responsavel: session.user?.name || session.user?.email || ""
      }],
      prazoVencimento: prazoVencimento ? new Date(prazoVencimento) : undefined,
      valorCausa,
      tags: tags || [],
      observacoes,
      documentos: [],
      dataAbertura: new Date(),
      dataAtualizacao: new Date()
    });

    return NextResponse.json({ 
      message: "Processo criado com sucesso",
      processo: novoProcesso 
    }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar processo:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
