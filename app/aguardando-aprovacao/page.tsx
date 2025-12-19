"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function AguardandoAprovacaoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [statusAprovacao, setStatusAprovacao] = useState<string>("pendente");
  const [loading, setLoading] = useState(true);

  const verificarStatus = async () => {
    try {
      const response = await fetch("/api/verificar-registro");
      const data = await response.json();
      
      if (data.statusAprovacao === "aprovado") {
        toast.success("Registro aprovado! Redirecionando...");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else if (data.statusAprovacao === "rejeitado") {
        setStatusAprovacao("rejeitado");
        toast.error("Seu registro foi rejeitado.");
      } else {
        setStatusAprovacao("pendente");
        toast.loading("Aguardando aprova\u00e7\u00e3o da ger\u00eancia...", { duration: 3000 });
      }
      setLoading(false);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      toast.error("Erro ao verificar status do registro");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (status === "authenticated") {
      verificarStatus();
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verificando status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {statusAprovacao === "pendente" && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6">
                <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400 animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                Aguardando Aprovação
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Seu registro foi enviado com sucesso!
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-center">
                Um membro da gerência irá analisar suas informações em breve. 
                Você receberá acesso ao sistema assim que seu cadastro for aprovado.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  toast.promise(
                    verificarStatus(),
                    {
                      loading: 'Verificando status...',
                      success: 'Status atualizado!',
                      error: 'Erro ao verificar status',
                    }
                  );
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
              >
                <RefreshCw className="w-5 h-5" />
                Verificar Status
              </button>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-all font-medium"
              >
                Sair
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Você pode fechar esta página e retornar mais tarde.
            </p>
          </>
        )}

        {statusAprovacao === "rejeitado" && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                Registro Rejeitado
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Infelizmente seu registro não foi aprovado.
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
              <p className="text-gray-700 dark:text-gray-300 text-center">
                Entre em contato com a administração para mais informações sobre a rejeição.
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
            >
              Sair
            </button>
          </>
        )}
      </div>
    </div>
  );
}
