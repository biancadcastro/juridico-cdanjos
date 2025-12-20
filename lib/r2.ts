import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * Upload de arquivo para o Cloudflare R2
 * @param file - Buffer do arquivo
 * @param fileName - Nome do arquivo (ex: "funcionarios/123_timestamp.jpg")
 * @param contentType - Tipo do arquivo (ex: "image/jpeg")
 * @returns URL pública do arquivo
 */
export async function uploadToR2(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: fileName,
    Body: file,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Retorna URL pública do CDN
  return `${process.env.R2_PUBLIC_URL}/${fileName}`;
}

/**
 * Deleta arquivo do Cloudflare R2
 * @param fileUrl - URL pública do arquivo (ex: "https://cdn.omnibots.net/funcionarios/123.jpg")
 */
export async function deleteFromR2(fileUrl: string): Promise<void> {
  try {
    // Extrai o nome do arquivo da URL
    const fileName = fileUrl.replace(`${process.env.R2_PUBLIC_URL}/`, "");

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: fileName,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error("Erro ao deletar arquivo do R2:", error);
    throw error;
  }
}
