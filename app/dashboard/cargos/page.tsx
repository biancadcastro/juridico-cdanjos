"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Shield, X, Save, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Permissao {
  modulo: string;
  acoes: string[];
}

interface Cargo {
  _id: string;
  nome: string;
  descricao: string;
  cor: string;
  permissoes: Permissao[];
  ativo: boolean;
}

const MODULOS_DISPONIVEIS = [
  "Processos",
  "Clientes",
  "Audiências",
  "Usuários",
  "Cargos",
  "Relatórios",
  "Configurações"
];

const ACOES_DISPONIVEIS = ["Visualizar", "Criar", "Editar", "Deletar"];

export default function CargosPage() {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [cargoEditando, setCargoEditando] = useState<Cargo | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    cor: "#3b82f6",
    permissoes: [] as Permissao[]
  });

  useEffect(() => {
    carregarCargos();
  }, []);

  const carregarCargos = async () => {
    try {
      const response = await fetch("/api/cargos");
      const data = await response.json();
      if (response.ok) {
        setCargos(data.cargos);
      }
    } catch (error) {
      toast.error("Erro ao carregar cargos");
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (cargo?: Cargo) => {
    if (cargo) {
      setCargoEditando(cargo);
      setFormData({
        nome: cargo.nome,
        descricao: cargo.descricao,
        cor: cargo.cor,
        permissoes: cargo.permissoes
      });
    } else {
      setCargoEditando(null);
      setFormData({
        nome: "",
        descricao: "",
        cor: "#3b82f6",
        permissoes: []
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setCargoEditando(null);
  };

  const adicionarPermissao = (modulo: string) => {
    if (!formData.permissoes.find(p => p.modulo === modulo)) {
      setFormData({
        ...formData,
        permissoes: [...formData.permissoes, { modulo, acoes: [] }]
      });
    }
  };

  const removerPermissao = (modulo: string) => {
    setFormData({
      ...formData,
      permissoes: formData.permissoes.filter(p => p.modulo !== modulo)
    });
  };

  const toggleAcao = (modulo: string, acao: string) => {
    setFormData({
      ...formData,
      permissoes: formData.permissoes.map(p => {
        if (p.modulo === modulo) {
          const acoes = p.acoes.includes(acao)
            ? p.acoes.filter(a => a !== acao)
            : [...p.acoes, acao];
          return { ...p, acoes };
        }
        return p;
      })
    });
  };

  const salvarCargo = async () => {
    if (!formData.nome.trim()) {
      toast.error("Nome do cargo é obrigatório");
      return;
    }

    try {
      const url = "/api/cargos";
      const method = cargoEditando ? "PUT" : "POST";
      const body = cargoEditando
        ? { id: cargoEditando._id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast.success(cargoEditando ? "Cargo atualizado!" : "Cargo criado!");
        fecharModal();
        carregarCargos();
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao salvar cargo");
      }
    } catch (error) {
      toast.error("Erro ao salvar cargo");
    }
  };

  const deletarCargo = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este cargo?")) return;

    try {
      const response = await fetch(`/api/cargos?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Cargo deletado!");
        carregarCargos();
      } else {
        toast.error("Erro ao deletar cargo");
      }
    } catch (error) {
      toast.error("Erro ao deletar cargo");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Gerenciamento de Cargos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Crie e gerencie cargos e suas permissões
          </p>
        </div>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Novo Cargo
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Permissões
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {cargos.map(cargo => (
                <tr key={cargo._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-12 rounded-full" style={{ backgroundColor: cargo.cor }}></div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-white">
                          {cargo.nome}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {cargo.descricao || "Sem descrição"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {cargo.permissoes.length} {cargo.permissoes.length === 1 ? 'módulo' : 'módulos'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirModal(cargo)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletarCargo(cargo._id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {cargos.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Nenhum cargo cadastrado ainda
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Clique em "Novo Cargo" para começar
          </p>
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {cargoEditando ? "Editar Cargo" : "Novo Cargo"}
              </h2>
              <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Cargo *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={e => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ex: Advogado, Secretário"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Descrição do cargo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor de Identificação
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.cor}
                    onChange={e => setFormData({ ...formData, cor: e.target.value })}
                    className="h-10 w-20 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{formData.cor}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Permissões
                </label>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Adicionar módulo:</p>
                  <div className="flex flex-wrap gap-2">
                    {MODULOS_DISPONIVEIS.map(modulo => (
                      <button
                        key={modulo}
                        onClick={() => adicionarPermissao(modulo)}
                        disabled={formData.permissoes.some(p => p.modulo === modulo)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        + {modulo}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.permissoes.map(permissao => (
                    <div key={permissao.modulo} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-800 dark:text-white">{permissao.modulo}</h4>
                        <button
                          onClick={() => removerPermissao(permissao.modulo)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ACOES_DISPONIVEIS.map(acao => (
                          <button
                            key={acao}
                            onClick={() => toggleAcao(permissao.modulo, acao)}
                            className={`px-3 py-1 text-sm rounded-lg transition-all ${
                              permissao.acoes.includes(acao)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                            }`}
                          >
                            {permissao.acoes.includes(acao) && <Check className="w-3 h-3 inline mr-1" />}
                            {acao}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700/50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={fecharModal}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvarCargo}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                {cargoEditando ? "Atualizar" : "Criar"} Cargo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
