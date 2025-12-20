"use client";

import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Ícone e código de erro */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-600/20 border-4 border-blue-400/30 rounded-full mb-6">
            <FileQuestion className="w-16 h-16 text-blue-400" />
          </div>
          <h1 className="text-8xl font-bold text-white mb-2">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Página Não Encontrada</h2>
          <p className="text-gray-300 text-lg mb-8">
            Desculpe, a página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
          >
            <Home className="w-5 h-5" />
            Voltar para Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Página Anterior
          </button>
        </div>

        {/* Informação adicional */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          <p className="text-gray-400 text-sm">
            Se você acredita que isso é um erro, entre em contato com o suporte ou tente novamente mais tarde.
          </p>
        </div>
      </div>
    </div>
  );
}
