"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Membro {
  _id: string;
  name: string;
  cargo: string;
  image: string;
  createdAt: string;
  hierarquia: number;
}

export default function HierarquiaPage() {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMembros();
  }, []);

  const carregarMembros = async () => {
    try {
      const response = await fetch("/api/equipe");
      const data = await response.json();
      if (response.ok) {
        setMembros(data.membros);
      }
    } catch (error) {
      console.error("Erro ao carregar membros:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Navbar />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">
              {membros.length} {membros.length === 1 ? 'Membro' : 'Membros'}
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Nossa Equipe</h2>
          <p className="text-gray-300 text-lg">
            Conheça os profissionais que compõem o Jurídico
          </p>
        </div>

        {membros.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-20 h-20 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 text-lg">Nenhum membro cadastrado ainda</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Agrupar membros por cargo */}
            {Object.entries(
              membros.reduce((acc, membro) => {
                if (!acc[membro.cargo]) {
                  acc[membro.cargo] = [];
                }
                acc[membro.cargo].push(membro);
                return acc;
              }, {} as Record<string, Membro[]>)
            ).map(([cargo, membrosDoCargo]) => (
              <div key={cargo}>
                {/* Header da Seção */}
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-white mb-2">{cargo}</h3>
                  <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                  <p className="text-gray-400 mt-2">
                    {membrosDoCargo.length} {membrosDoCargo.length === 1 ? 'membro' : 'membros'}
                  </p>
                </div>

                {/* Grid de Membros do Cargo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {membrosDoCargo.map(membro => (
                    <div 
                      key={membro._id} 
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300 hover:scale-105"
                    >
                      {/* Foto 3:4 */}
                      <div className="relative aspect-[3/4] bg-gradient-to-br from-blue-900/50 to-purple-900/50 overflow-hidden">
                        {membro.image ? (
                          <img 
                            src={membro.image} 
                            alt={membro.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-blue-600/30 flex items-center justify-center">
                              <span className="text-5xl font-bold text-white">
                                {membro.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-white mb-1 truncate">
                          {membro.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>Desde {formatarData(membro.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-black/30 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-400 text-sm">
            © 2025 Jurídico - Cidade dos Anjos. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
