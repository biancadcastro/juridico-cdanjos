"use client";

import { useEffect, useState } from "react";
import { Edit2, DollarSign, X } from "lucide-react";
import toast from "react-hot-toast";

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  valorPadrao: number;
  categoria: string;
  valorCustomizado: boolean;
}

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [servicoEditando, setServicoEditando] = useState<Servico | null>(null);
  const [valorEditando, setValorEditando] = useState(0);

  useEffect(() => {
    carregarServicos();
  }, []);

  const carregarServicos = async () => {
    try {
      const response = await fetch("/api/servicos");
      if (response.ok) {
        const data = await response.json();
        setServicos(data);
      } else {
        toast.error("Erro ao carregar serviços");
      }
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicoEditando) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/servicos/${servicoEditando.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ valor: valorEditando }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Valor atualizado com sucesso!");
        setModalAberto(false);
        setServicoEditando(null);
        carregarServicos();
      } else {
        toast.error(data.error || "Erro ao atualizar valor");
      }
    } catch (error) {
      console.error("Erro ao atualizar valor:", error);
      toast.error("Erro ao atualizar valor");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (servico: Servico) => {
    setServicoEditando(servico);
    setValorEditando(servico.valor);
    setModalAberto(true);
  };

  const handleResetarValor = async (servico: Servico) => {
    if (!confirm("Tem certeza que deseja resetar o valor para o padrão?")) return;

    try {
      const response = await fetch(`/api/servicos/${servico.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Valor resetado para o padrão!");
        carregarServicos();
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao resetar valor");
      }
    } catch (error) {
      console.error("Erro ao resetar valor:", error);
      toast.error("Erro ao resetar valor");
    }
  };

  // Agrupar serviços por categoria
  const servicosPorCategoria = servicos.reduce((acc, servico) => {
    if (!acc[servico.categoria]) {
      acc[servico.categoria] = [];
    }
    acc[servico.categoria].push(servico);
    return acc;
  }, {} as Record<string, Servico[]>);

  if (loading && servicos.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Serviços
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie os valores dos serviços pré-definidos
          </p>
        </div>
      </div>

      {/* Lista de Serviços por Categoria */}
      {servicos.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            Nenhum serviço encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Verifique a conexão com o servidor
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(servicosPorCategoria).map(([categoria, servicosCategoria]) => (
            <div key={categoria}>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                {categoria}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {servicosCategoria.map((servico) => (
                  <div
                    key={servico.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {servico.nome}
                          </h3>
                          {servico.valorCustomizado && (
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                              Customizado
                            </span>
                          )}
                        </div>
                        {servico.descricao && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {servico.descricao}
                          </p>
                        )}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                            <DollarSign className="w-6 h-6" />
                            {servico.valor.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                          {servico.valorCustomizado && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Valor padrão: R$ {servico.valorPadrao.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleEditar(servico)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar Valor
                      </button>
                      {servico.valorCustomizado && (
                        <button
                          onClick={() => handleResetarValor(servico)}
                          className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Resetar para valor padrão"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editar Valor */}
      {modalAberto && servicoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Editar Valor do Serviço
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {servicoEditando.nome}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor Padrão
                </label>
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg">
                  R$ {servicoEditando.valorPadrao.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Novo Valor (R$) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={valorEditando}
                  onChange={(e) => setValorEditando(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalAberto(false);
                    setServicoEditando(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
