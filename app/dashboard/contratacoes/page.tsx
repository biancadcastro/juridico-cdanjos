"use client";

import { useEffect, useState } from "react";
import { UserCheck, UserX, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface Usuario {
  _id: string;
  name: string;
  email: string;
  passaporte: string;
  contratadoPor: string;
  cargo: string;
  statusAprovacao: string;
  createdAt: string;
}

export default function AprovacoesPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState<string | null>(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await fetch("/api/contratacoes");
      const data = await response.json();
      if (response.ok) {
        setUsuarios(data.usuarios);
      } else {
        toast.error(data.error || "Erro ao carregar usuários");
      }
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const processarAprovacao = async (userId: string, acao: "aprovar" | "recusar") => {
    setProcessando(userId);
    try {
      const response = await fetch("/api/contratacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, acao })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(acao === "aprovar" ? "Usuário aprovado!" : "Usuário recusado!");
        carregarUsuarios();
      } else {
        toast.error(data.error || "Erro ao processar aprovação");
      }
    } catch (error) {
      toast.error("Erro ao processar aprovação");
    } finally {
      setProcessando(null);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <UserCheck className="w-8 h-8 text-blue-600" />
            Contratações
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Aprove ou recuse solicitações de contratação
          </p>
        </div>
        <button
          onClick={carregarUsuarios}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {usuarios.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Nenhuma solicitação de contratação pendente
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Quando houver novas contratações, elas aparecerão aqui
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Passaporte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contratado Por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {usuarios.map(usuario => (
                  <tr key={usuario._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-white">
                          {usuario.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {usuario.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {usuario.passaporte}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {usuario.cargo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {usuario.contratadoPor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatarData(usuario.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => processarAprovacao(usuario._id, "aprovar")}
                          disabled={processando === usuario._id}
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
                          title="Aprovar"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Aprovar
                        </button>
                        <button
                          onClick={() => processarAprovacao(usuario._id, "recusar")}
                          disabled={processando === usuario._id}
                          className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm font-medium"
                          title="Recusar"
                        >
                          <XCircle className="w-4 h-4" />
                          Recusar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
