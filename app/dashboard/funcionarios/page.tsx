"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Trash2, Calendar, IdCard, UserCog, AlertCircle, Lock, MoreVertical, Upload, Eye, Download, X, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import OABTemplate from "@/components/OABTemplate";
import html2canvas from "html2canvas";
import toast, { Toaster } from "react-hot-toast";

interface Funcionario {
  _id: string;
  name: string;
  email: string;
  cargo: string;
  passaporte: string;
  contratadoPor: string;
  createdAt: string;
  statusAprovacao: string;
  fotoOAB?: string;
  numeroOAB?: string;
  cpf?: string;
}

interface Cargo {
  _id: string;
  nome: string;
  hierarquia: number;
  cor: string;
}

interface Permissoes {
  visualizar: boolean;
  editarCargo: boolean;
  demitir: boolean;
}

export default function FuncionariosPage() {
  const { data: session } = useSession();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState<string | null>(null);
  const [permissoes, setPermissoes] = useState<Permissoes>({
    visualizar: false,
    editarCargo: false,
    demitir: false
  });
  const [cargoUsuario, setCargoUsuario] = useState<any>(null);
  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  const [modalFoto, setModalFoto] = useState<Funcionario | null>(null);
  const [modalCarteirinha, setModalCarteirinha] = useState<Funcionario | null>(null);
  const [uploadando, setUploadando] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    carregarPermissoes();
    carregarDados();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuAberto && !(e.target as Element).closest('.menu-dropdown')) {
        setMenuAberto(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuAberto]);

  const carregarPermissoes = async () => {
    try {
      const response = await fetch("/api/cargos");
      const data = await response.json();
      
      if (response.ok) {
        const userResponse = await fetch("/api/verificar-registro");
        const userData = await userResponse.json();
        
        if (userData.user && userData.user.cargo) {
          const cargo = data.cargos.find((c: any) => c.nome === userData.user.cargo);
          setCargoUsuario(cargo);
          
          if (cargo && cargo.permissoes) {
            const permFuncionarios = cargo.permissoes.find(
              (p: any) => p.modulo === "Funcionários"
            );
            
            if (permFuncionarios && permFuncionarios.acoes) {
              setPermissoes({
                visualizar: permFuncionarios.acoes.includes("Visualizar"),
                editarCargo: permFuncionarios.acoes.includes("Editar Cargo"),
                demitir: permFuncionarios.acoes.includes("Demitir")
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
    }
  };

  const carregarDados = async () => {
    try {
      const [funcionariosRes, cargosRes] = await Promise.all([
        fetch("/api/equipe"),
        fetch("/api/cargos")
      ]);

      const funcionariosData = await funcionariosRes.json();
      const cargosData = await cargosRes.json();

      if (funcionariosRes.ok) {
        setFuncionarios(funcionariosData.membros || []);
      }

      if (cargosRes.ok) {
        setCargos(cargosData.cargos || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarCargo = async (funcionarioId: string, novoCargo: string) => {
    setAtualizando(funcionarioId);
    try {
      const response = await fetch(`/api/equipe/${funcionarioId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cargo: novoCargo })
      });

      if (response.ok) {
        setFuncionarios(prev =>
          prev.map(f =>
            f._id === funcionarioId ? { ...f, cargo: novoCargo } : f
          )
        );
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao atualizar cargo");
      }
    } catch (error) {
      console.error("Erro ao atualizar cargo:", error);
      alert("Erro ao atualizar cargo");
    } finally {
      setAtualizando(null);
    }
  };

  const demitirFuncionario = async (funcionarioId: string, nome: string) => {
    if (!confirm(`Deseja realmente demitir ${nome}?`)) {
      return;
    }

    setAtualizando(funcionarioId);
    try {
      const response = await fetch(`/api/equipe/${funcionarioId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setFuncionarios(prev => prev.filter(f => f._id !== funcionarioId));
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao demitir funcionário");
      }
    } catch (error) {
      console.error("Erro ao demitir funcionário:", error);
      alert("Erro ao demitir funcionário");
    } finally {
      setAtualizando(null);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const handleUploadFoto = async (funcionario: Funcionario, file: File) => {
    setUploadando(true);
    try {
      const formData = new FormData();
      formData.append("foto", file);

      const response = await fetch(`/api/equipe/${funcionario._id}/foto`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFuncionarios(prev =>
          prev.map(f =>
            f._id === funcionario._id ? { ...f, fotoOAB: data.fotoUrl } : f
          )
        );
        setModalFoto(null);
        toast.success("Foto enviada com sucesso!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao enviar foto");
      }
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      toast.error("Erro ao enviar foto");
    } finally {
      setUploadando(false);
    }
  };

  const exportarCarteirinha = async (funcionario: Funcionario) => {
    try {
      const element = document.getElementById(`oab-preview-${funcionario._id}`);
      if (!element) {
        alert("Erro: Template não encontrado");
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: false,
        width: 800,
        height: 600,
        windowWidth: 800,
        windowHeight: 600
      });

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = 1600;
      finalCanvas.height = 1200;
      const ctx = finalCanvas.getContext('2d');
      
      if (ctx) {
        // Fundo transparente para preservar bordas arredondadas
        ctx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(canvas, 0, 0);
      }

      finalCanvas.toBlob((blob) => {
        if (!blob) {
          alert("Erro ao gerar imagem");
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `OAB_${funcionario.passaporte || funcionario.name.replace(/\s+/g, '_')}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error("Erro ao exportar carteirinha:", error);
      alert("Erro ao exportar carteirinha");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400 dark:text-gray-300">Carregando funcionários...</p>
        </div>
      </div>
    );
  }

  if (!permissoes.visualizar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 max-w-md">
          <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Acesso Negado</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Você não tem permissão para visualizar esta página.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Entre em contato com um administrador para solicitar acesso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '2px solid #374151',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f9fafb',
            },
            style: {
              background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
              border: '2px solid #34d399',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f9fafb',
            },
            style: {
              background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
              border: '2px solid #f87171',
            },
          },
        }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Funcionários</h1>
            </div>
            <button
              onClick={carregarDados}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Recarregar
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os funcionários da equipe, altere cargos e realize demissões
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total de Funcionários</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {funcionarios.length}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Cargos Disponíveis</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {cargos.length}
                </p>
              </div>
              <UserCog className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Sem Cargo</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                  {funcionarios.filter(f => !f.cargo).length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Aprovados</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {funcionarios.filter(f => f.statusAprovacao === "aprovado").length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Lista de Funcionários */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          {funcionarios.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum funcionário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-visible">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Funcionário
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Passaporte
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Cargo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Contratado Por
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Data de Entrada
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-100 dark:divide-gray-700">
                  {funcionarios.map((funcionario) => (
                    <tr 
                      key={funcionario._id} 
                      className={`transition-all duration-200 ${
                        !funcionario.cargo 
                          ? 'bg-orange-50/50 dark:bg-orange-900/10 border-l-4 border-orange-500 hover:bg-orange-100/50 dark:hover:bg-orange-900/20' 
                          : 'hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10'
                      }`}
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {funcionario.fotoOAB ? (
                            <img 
                              src={funcionario.fotoOAB}
                              alt={funcionario.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {funcionario.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{funcionario.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{funcionario.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <IdCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {funcionario.passaporte || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="min-w-[200px]">
                          <select
                            value={funcionario.cargo || ""}
                            onChange={(e) => atualizarCargo(funcionario._id, e.target.value)}
                            disabled={atualizando === funcionario._id || !permissoes.editarCargo}
                            className={`block w-full px-4 py-2.5 bg-white dark:bg-gray-700 border-2 rounded-lg shadow-sm text-sm font-medium hover:border-blue-500 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-600 transition-all cursor-pointer appearance-none bg-no-repeat bg-right pr-10 ${
                              !funcionario.cargo 
                                ? 'border-orange-500 dark:border-orange-500 text-orange-700 dark:text-orange-400' 
                                : 'border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
                            }`}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: 'right 0.5rem center',
                              backgroundSize: '1.5em 1.5em'
                            }}
                          >
                            <option value="" disabled>
                              {!funcionario.cargo ? '⚠️ Selecione um cargo' : 'Selecione um cargo'}
                            </option>
                            {cargos.map((cargo) => (
                              <option key={cargo._id} value={cargo.nome}>
                                {cargo.nome}
                              </option>
                            ))}
                          </select>
                          {!permissoes.editarCargo && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Sem permissão
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="font-medium text-gray-900 dark:text-gray-200">
                          {funcionario.contratadoPor || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {formatarData(funcionario.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap relative">
                        <div className="menu-dropdown">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuAberto(menuAberto === funcionario._id ? null : funcionario._id);
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            title="Ações"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          </button>

                          {menuAberto === funcionario._id && (
                            <div className="fixed mt-2 w-64 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[100]" style={{
                              top: `${(document.activeElement as HTMLElement)?.getBoundingClientRect().bottom || 0}px`,
                              left: `${((document.activeElement as HTMLElement)?.getBoundingClientRect().right || 0) - 256}px`
                            }}>
                              <div className="py-2">
                                <button
                                  onClick={() => {
                                    setModalFoto(funcionario);
                                    setMenuAberto(null);
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-3 transition-all group"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-all">
                                    <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <span>Upload Foto 3:4</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setModalCarteirinha(funcionario);
                                    setMenuAberto(null);
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 flex items-center gap-3 transition-all group"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-all">
                                    <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  </div>
                                  <span>Visualizar Carteirinha</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setModalCarteirinha(funcionario);
                                    setMenuAberto(null);
                                    // Aguarda o modal renderizar e então exporta
                                    setTimeout(() => {
                                      exportarCarteirinha(funcionario);
                                    }, 100);
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-3 transition-all group"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-all">
                                    <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <span>Exportar Carteirinha</span>
                                </button>

                                {permissoes.demitir && (
                                  <>
                                    <div className="border-t-2 border-gray-100 dark:border-gray-700 my-2"></div>
                                    <button
                                      onClick={() => {
                                        demitirFuncionario(funcionario._id, funcionario.name);
                                        setMenuAberto(null);
                                      }}
                                      disabled={atualizando === funcionario._id}
                                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                      <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-all">
                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                      </div>
                                      <span>Demitir Funcionário</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Upload Foto */}
        {modalFoto && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-8 border-2 border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Upload Foto 3:4
                  </h3>
                  <p className="text-sm text-gray-400">
                    {modalFoto.name}
                  </p>
                </div>
                <button
                  onClick={() => setModalFoto(null)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    handleUploadFoto(modalFoto, file);
                  } else {
                    toast.error('Por favor, envie apenas arquivos de imagem');
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
                    : 'border-gray-600 bg-gray-800/50 hover:border-blue-400 hover:bg-gray-800'
                } ${uploadando ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUploadFoto(modalFoto, file);
                    }
                  }}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-4">
                  <div className={`p-6 rounded-full transition-all duration-300 ${
                    isDragging
                      ? 'bg-blue-500/20 scale-110'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold text-white mb-2">
                      {isDragging ? 'Solte a imagem aqui' : 'Arraste a foto aqui'}
                    </p>
                    <p className="text-sm text-gray-400">
                      Proporção 3:4 recomendada
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG ou JPEG até 10MB
                    </p>
                  </div>

                  {uploadando && (
                    <div className="flex items-center gap-2 mt-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      <span className="text-sm text-gray-400">Enviando...</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setModalFoto(null)}
                disabled={uploadando}
                className="mt-6 w-full px-4 py-3 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal Visualizar Carteirinha */}
        {modalCarteirinha && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6 my-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Carteirinha OAB - {modalCarteirinha.name}
                </h3>
                <button
                  onClick={() => setModalCarteirinha(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex justify-center mb-4">
                <div id={`oab-preview-${modalCarteirinha._id}`}>
                  <OABTemplate
                    numeroOAB={modalCarteirinha.numeroOAB || `${modalCarteirinha.passaporte}/CDA`}
                    nomeAdvogado={modalCarteirinha.name}
                    cpf={modalCarteirinha.cpf || modalCarteirinha.passaporte?.slice(-4) || "0000"}
                    dataEmissao={formatarData(modalCarteirinha.createdAt)}
                    estadoOAB="CDA"
                    categoria={modalCarteirinha.cargo || "Advogado(a)"}
                    situacao="REGULAR"
                    fotoAdvogado={modalCarteirinha.fotoOAB}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setModalCarteirinha(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    exportarCarteirinha(modalCarteirinha);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar PNG
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
