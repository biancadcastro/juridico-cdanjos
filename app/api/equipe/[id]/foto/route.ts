import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const formData = await request.formData();
    const foto = formData.get("foto") as File;

    if (!foto) {
      return NextResponse.json({ error: "Foto é obrigatória" }, { status: 400 });
    }

    // Validar tipo de arquivo
    if (!foto.type.startsWith("image/")) {
      return NextResponse.json({ error: "Arquivo deve ser uma imagem" }, { status: 400 });
    }

    // Buscar usuário para verificar se já tem foto
    const usuarioAtual = await User.findById(id);
    if (!usuarioAtual) {
      return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 });
    }

    // Deletar foto antiga do R2 se existir
    if (usuarioAtual.fotoOAB) {
      try {
        await deleteFromR2(usuarioAtual.fotoOAB);
      } catch (error) {
        console.error("Erro ao deletar foto antiga do R2:", error);
        // Continua mesmo se falhar ao deletar
      }
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const extensao = foto.type.split("/")[1];
    const fileName = `funcionarios/${id}_${timestamp}.${extensao}`;

    // Converter File para Buffer
    const bytes = await foto.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload para o R2
    const fotoUrl = await uploadToR2(buffer, fileName, foto.type);

    // Atualizar usuário no banco
    usuarioAtual.fotoOAB = fotoUrl;
    await usuarioAtual.save();

    return NextResponse.json({ 
      message: "Foto enviada com sucesso",
      fotoUrl
    }, { status: 200 });
  } catch (error) {
    console.error("Erro ao fazer upload da foto:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
