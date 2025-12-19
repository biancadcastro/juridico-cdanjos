"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserCircle, Briefcase, IdCard } from "lucide-react";

export default function CompletarRegistroPage() {
  const [nome, setNome] = useState("");
  const [passaporte, setPassaporte] = useState("");
  const [contratadoPor, setContratadoPor] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    
    if (session?.user?.name) {
      setNome(session.user.name);
    }
  }, [status, session, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!passaporte.trim() || !contratadoPor.trim()) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/completar-registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          nome: nome.trim(),
          passaporte: passaporte.trim(), 
          contratadoPor: contratadoPor.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao completar registro");
        return;
      }

      router.push("/aguardando-aprovacao");
      router.refresh();
    } catch (error) {
      setError("Erro ao completar registro");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <UserCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Complete seu Registro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Precisamos de mais algumas informações para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Nome Completo
              </div>
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label htmlFor="passaporte" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <IdCard className="w-4 h-4" />
                Passaporte
              </div>
            </label>
            <input
              type="text"
              id="passaporte"
              value={passaporte}
              onChange={(e) => setPassaporte(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
              placeholder="Número do passaporte"
            />
          </div>

          <div>
            <label htmlFor="contratadoPor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Pessoa que Contratou
              </div>
            </label>
            <input
              type="text"
              id="contratadoPor"
              value={contratadoPor}
              onChange={(e) => setContratadoPor(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
              placeholder="Nome de quem contratou"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : "Completar Registro"}
          </button>
        </form>
      </div>
    </div>
  );
}
