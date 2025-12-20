"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log do erro no console
    console.error("Erro capturado:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Ícone e código de erro */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-red-600/20 border-4 border-red-400/30 rounded-full mb-6 animate-pulse">
            <AlertTriangle className="w-16 h-16 text-red-400" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-2">Oops!</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Algo deu errado</h2>
          <p className="text-gray-300 text-lg mb-8">
            Encontramos um problema inesperado. Nossa equipe foi notificada e estamos trabalhando para corrigi-lo.
          </p>
        </div>

        {/* Detalhes do erro (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-red-950/50 border border-red-400/30 rounded-lg text-left">
            <p className="text-red-300 text-sm font-mono break-all">
              <strong>Erro:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-red-400 text-xs font-mono mt-2">
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
          >
            <RotateCcw className="w-5 h-5" />
            Tentar Novamente
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200 hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Voltar para Home
          </Link>
        </div>

        {/* Informação adicional */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          <p className="text-gray-400 text-sm mb-2">
            <strong>O que você pode fazer:</strong>
          </p>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Recarregar a página</li>
            <li>• Verificar sua conexão com a internet</li>
            <li>• Tentar novamente em alguns minutos</li>
            <li>• Entrar em contato com o suporte se o problema persistir</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
