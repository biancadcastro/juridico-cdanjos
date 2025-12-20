"use client";

import { useEffect, useState, useRef } from "react";
import { FileText, Plus, Search, Filter, Calendar, User, AlertCircle, Tag, MapPin, Book, Download } from "lucide-react";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

// Importar CertidaoTemplate dinamicamente para evitar problemas com SSR
const CertidaoTemplate = dynamic(() => import("@/components/CertidaoTemplate"), { ssr: false });

interface Processo {
  _id: string;
  numeroProcesso: string;
  tipo: string;
  titulo: string;
  descricao: string;
  cliente: string;
  partes: string[];
  responsavel: string;
  status: "ativo" | "arquivado" | "aguardando" | "finalizado";
  prioridade: "baixa" | "media" | "alta" | "urgente";
  cartorio?: string;
  livro?: string;
  folha?: string;
  termo?: string;
  dataRegistro?: string;
  cidadeUF?: string;
  prazoVencimento?: string;
  valorCausa?: number;
  tags: string[];
  observacoes?: string;
  dataAbertura: string;
  dataAtualizacao: string;
}

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  valorPadrao: number;
  categoria: string;
  valorCustomizado: boolean;
}

export default function ProcessosPage() {
  const { data: session } = useSession();
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [etapaModal, setEtapaModal] = useState<"selecao" | "formulario">("selecao");
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("");
  const [processoDetalhes, setProcessoDetalhes] = useState<Processo | null>(null);
  const [modalCertidao, setModalCertidao] = useState(false);
  const [processoSelecionado, setProcessoSelecionado] = useState<Processo | null>(null);
  const [desembargadora, setDesembargadora] = useState<string>("Dra. Maria Silva Santos");
  const certidaoRef = useRef<HTMLDivElement>(null);
  const [novoProcesso, setNovoProcesso] = useState({
    tipo: "Certidão de Casamento" as const,
    servicoId: "",
    descricao: "",
    cliente: "",
    partes: "",
    status: "ativo" as const,
    prioridade: "media" as const,
    valorCausa: "",
    observacoes: ""
  });

  useEffect(() => {
    carregarProcessos();
    carregarServicos();
    carregarDesembargadora();
  }, []);

  const carregarServicos = async () => {
    try {
      const response = await fetch("/api/servicos");
      if (response.ok) {
        const data = await response.json();
        setServicos(data);
      }
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
    }
  };

  const carregarDesembargadora = async () => {
    try {
      const response = await fetch("/api/equipe");
      if (response.ok) {
        const data = await response.json();
        console.log("Membros da equipe:", data.membros);
        
        const desembargadoraUser = data.membros?.find((user: any) => {
          console.log("Verificando usuário:", user.name, "Cargo:", user.cargo);
          return user.cargo?.toLowerCase().trim() === "desembargadora";
        });
        
        console.log("Desembargadora encontrada:", desembargadoraUser);
        
        if (desembargadoraUser) {
          setDesembargadora(desembargadoraUser.name);
          console.log("Nome da desembargadora definido:", desembargadoraUser.name);
        } else {
          console.log("Nenhuma desembargadora encontrada, usando valor padrão");
        }
      }
    } catch (error) {
      console.error("Erro ao carregar desembargadora:", error);
    }
  };

  const carregarProcessos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/processos");
      const data = await response.json();

      if (response.ok) {
        setProcessos(data.processos);
      } else {
        toast.error(data.error || "Erro ao carregar processos");
      }
    } catch (error) {
      console.error("Erro ao carregar processos:", error);
      toast.error("Erro ao carregar processos");
    } finally {
      setLoading(false);
    }
  };

  const handleCriarProcesso = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novoProcesso.servicoId || !novoProcesso.cliente) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const servico = servicos.find(s => s.id === novoProcesso.servicoId);
    if (!servico) {
      toast.error("Serviço inválido");
      return;
    }

    try {
      const response = await fetch("/api/processos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: servico.nome,
          ...novoProcesso,
          partes: novoProcesso.partes ? novoProcesso.partes.split(",").map(p => p.trim()) : [],
          valorCausa: novoProcesso.valorCausa ? parseFloat(novoProcesso.valorCausa) : undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Processo criado com sucesso!");
        setModalAberto(false);
        setEtapaModal("selecao");
        setTipoSelecionado("");
        setNovoProcesso({
          tipo: "Certidão de Casamento",
          servicoId: "",
          descricao: "",
          cliente: "",
          partes: "",
          status: "ativo",
          prioridade: "media",
          valorCausa: "",
          observacoes: ""
        });
        carregarProcessos();
      } else {
        toast.error(data.error || "Erro ao criar processo");
      }
    } catch (error) {
      console.error("Erro ao criar processo:", error);
      toast.error("Erro ao criar processo");
    }
  };

  const processosFiltrados = processos.filter(processo => {
    const matchStatus = filtroStatus === "todos" || processo.status === filtroStatus;
    const matchTipo = filtroTipo === "todos" || processo.tipo === filtroTipo;
    const matchBusca = processo.numeroProcesso.toLowerCase().includes(busca.toLowerCase()) ||
                       processo.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                       processo.cliente.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchTipo && matchBusca;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "aguardando": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "arquivado": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "finalizado": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ativo": return "Ativo";
      case "aguardando": return "Aguardando";
      case "arquivado": return "Arquivado";
      case "finalizado": return "Finalizado";
      default: return status;
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "urgente": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "alta": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "media": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "baixa": return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeText = (prioridade: string) => {
    switch (prioridade) {
      case "urgente": return "Urgente";
      case "alta": return "Alta";
      case "media": return "Média";
      case "baixa": return "Baixa";
      default: return prioridade;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando processos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Processos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie todos os processos jurídicos
          </p>
        </div>
        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Processo
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número, título ou cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="todos">Todos os tipos</option>
          <option value="Certidão de Casamento">Certidão de Casamento</option>
        </select>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="aguardando">Aguardando</option>
          <option value="arquivado">Arquivado</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      {/* Lista de Processos */}
      {processosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {busca || filtroStatus !== "todos" ? "Nenhum processo encontrado" : "Nenhum processo cadastrado"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {processosFiltrados.map((processo) => (
            <div
              key={processo._id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setProcessoDetalhes(processo)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {processo.titulo}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {processo.tipo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Processo: {processo.numeroProcesso}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(processo.prioridade)}`}>
                    {getPrioridadeText(processo.prioridade)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(processo.status)}`}>
                    {getStatusText(processo.status)}
                  </span>
                </div>
              </div>

              {processo.descricao && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {processo.descricao}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm mb-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>Cliente: {processo.cliente}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  <span>Responsável: {processo.responsavel}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(processo.dataAbertura).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>

              {processo.cartorio && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Cartório: {processo.cartorio} - {processo.cidadeUF}</span>
                </div>
              )}

              {processo.tags && processo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {processo.tags.map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Detalhes */}
      {processoDetalhes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setProcessoDetalhes(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Detalhes do Processo
              </h2>
              <button onClick={() => setProcessoDetalhes(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Número do Processo</label>
                    <p className="text-gray-800 dark:text-white">{processoDetalhes.numeroProcesso}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo</label>
                    <p className="text-gray-800 dark:text-white">{processoDetalhes.tipo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Cliente</label>
                    <p className="text-gray-800 dark:text-white">{processoDetalhes.cliente}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Responsável</label>
                    <p className="text-gray-800 dark:text-white">{processoDetalhes.responsavel}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                    <p className="text-gray-800 dark:text-white">{getStatusText(processoDetalhes.status)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Prioridade</label>
                    <p className="text-gray-800 dark:text-white">{getPrioridadeText(processoDetalhes.prioridade)}</p>
                  </div>
                </div>
              </div>

              {/* Partes */}
              {processoDetalhes.partes && processoDetalhes.partes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Partes Envolvidas</h3>
                  <ul className="list-disc list-inside text-gray-800 dark:text-white">
                    {processoDetalhes.partes.map((parte, index) => (
                      <li key={index}>{parte}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dados do Cartório */}
              {processoDetalhes.cartorio && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Dados do Cartório</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Cartório</label>
                      <p className="text-gray-800 dark:text-white">{processoDetalhes.cartorio}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Cidade/UF</label>
                      <p className="text-gray-800 dark:text-white">{processoDetalhes.cidadeUF}</p>
                    </div>
                    {processoDetalhes.livro && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Livro</label>
                        <p className="text-gray-800 dark:text-white">{processoDetalhes.livro}</p>
                      </div>
                    )}
                    {processoDetalhes.folha && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Folha</label>
                        <p className="text-gray-800 dark:text-white">{processoDetalhes.folha}</p>
                      </div>
                    )}
                    {processoDetalhes.termo && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Termo</label>
                        <p className="text-gray-800 dark:text-white">{processoDetalhes.termo}</p>
                      </div>
                    )}
                    {processoDetalhes.dataRegistro && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Data de Registro</label>
                        <p className="text-gray-800 dark:text-white">{new Date(processoDetalhes.dataRegistro).toLocaleDateString("pt-BR")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Observações */}
              {processoDetalhes.observacoes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Observações</h3>
                  <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{processoDetalhes.observacoes}</p>
                </div>
              )}

              {/* Botão Gerar Certidão */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setProcessoSelecionado(processoDetalhes);
                    setModalCertidao(true);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Gerar Certidão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Processo */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {etapaModal === "selecao" ? "Selecionar Tipo de Processo" : "Novo Processo"}
              </h2>
              <button 
                onClick={() => {
                  setModalAberto(false);
                  setEtapaModal("selecao");
                  setTipoSelecionado("");
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {etapaModal === "selecao" ? (
              /* Etapa de Seleção de Tipo */
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Selecione o tipo de processo que deseja criar:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      const servico = servicos.find(s => s.id === "certidao-casamento");
                      if (servico) {
                        setNovoProcesso({
                          ...novoProcesso,
                          servicoId: servico.id,
                          valorCausa: servico.valor.toString()
                        });
                      }
                      setTipoSelecionado("Certidão de Casamento");
                      setEtapaModal("formulario");
                    }}
                    className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Certidão de Casamento
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Registro de união matrimonial entre duas pessoas
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              /* Etapa de Formulário */
              <div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      {tipoSelecionado}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setEtapaModal("selecao");
                      setTipoSelecionado("");
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Trocar tipo
                  </button>
                </div>

            <form onSubmit={handleCriarProcesso} className="p-6 space-y-4">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={novoProcesso.cliente}
                    onChange={(e) => setNovoProcesso({ ...novoProcesso, cliente: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Partes Envolvidas
                  </label>
                  <input
                    type="text"
                    value={novoProcesso.partes}
                    onChange={(e) => setNovoProcesso({ ...novoProcesso, partes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Separar por vírgula"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={novoProcesso.descricao}
                  onChange={(e) => setNovoProcesso({ ...novoProcesso, descricao: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  placeholder="Descrição detalhada do processo..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={novoProcesso.status}
                    onChange={(e) => setNovoProcesso({ ...novoProcesso, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="aguardando">Aguardando</option>
                    <option value="arquivado">Arquivado</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={novoProcesso.prioridade}
                    onChange={(e) => setNovoProcesso({ ...novoProcesso, prioridade: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Dados do Cartório */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Dados do Cartório</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Cartório:</strong> 1° Tabelião Angelical
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Localização:</strong> Cidade dos Anjos
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                    * Livro, Folha, Termo e Data de Registro serão gerados automaticamente
                  </p>
                </div>
              </div>

              {/* Outras Informações */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor da Causa
                    </label>
                    <input
                      type="text"
                      value={novoProcesso.valorCausa ? `R$ ${parseFloat(novoProcesso.valorCausa).toFixed(2)}` : ""}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-not-allowed"
                      placeholder="Será preenchido automaticamente"
                    />
                  </div>
                </div>

                <div className="mt-4">

                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={novoProcesso.observacoes}
                    onChange={(e) => setNovoProcesso({ ...novoProcesso, observacoes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    placeholder="Observações adicionais..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Criando..." : "Criar Processo"}
                </button>
              </div>
            </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Certidão */}
      {modalCertidao && processoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Visualizar Certidão
              </h2>
              <button 
                onClick={() => {
                  setModalCertidao(false);
                  setProcessoSelecionado(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div ref={certidaoRef} className="mb-6">
                <CertidaoTemplate
                  numeroProcesso={processoSelecionado.numeroProcesso}
                  titulo={processoSelecionado.titulo}
                  cliente={processoSelecionado.cliente}
                  partes={processoSelecionado.partes || []}
                  cartorio={processoSelecionado.cartorio || ""}
                  livro={processoSelecionado.livro || ""}
                  folha={processoSelecionado.folha || ""}
                  termo={processoSelecionado.termo || ""}
                  dataRegistro={processoSelecionado.dataRegistro || processoSelecionado.dataAbertura}
                  cidadeUF={processoSelecionado.cidadeUF || ""}
                  valorCausa={processoSelecionado.valorCausa || 0}
                  dataAbertura={processoSelecionado.dataAbertura}
                  responsavel={processoSelecionado.responsavel}
                  desembargadora={desembargadora}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setModalCertidao(false);
                    setProcessoSelecionado(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={async () => {
                    try {
                      const html2canvas = (await import('html2canvas')).default;
                      
                      if (certidaoRef.current) {
                        toast.loading("Gerando imagem...");
                        
                        const canvas = await html2canvas(certidaoRef.current, {
                          scale: 2,
                          useCORS: true,
                          logging: false,
                          backgroundColor: '#ffffff'
                        });
                        
                        // Converter para PNG e baixar
                        canvas.toBlob((blob) => {
                          if (blob) {
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `Certidao_${processoSelecionado.numeroProcesso}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                            
                            toast.dismiss();
                            toast.success("Imagem gerada com sucesso!");
                          }
                        }, 'image/png');
                      }
                    } catch (error) {
                      console.error("Erro ao gerar imagem:", error);
                      toast.dismiss();
                      toast.error("Erro ao gerar imagem");
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Baixar PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
