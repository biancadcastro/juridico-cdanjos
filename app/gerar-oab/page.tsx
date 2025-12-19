"use client";

import { useState } from "react";
import OABTemplate from "@/components/OABTemplate";
import { Download, Edit3, Upload, X } from "lucide-react";
import html2canvas from "html2canvas";

export default function GerarOABPage() {
  const [formData, setFormData] = useState({
    numeroOAB: "123.456/CDA",
    nomeAdvogado: "Bianca Saito",
    cpf: "3298",
    dataEmissao: new Date().toLocaleDateString("pt-BR"),
    estadoOAB: "CDA",
    categoria: "Advogado(a)",
    situacao: "REGULAR"
  });

  const [fotoAdvogado, setFotoAdvogado] = useState<string | null>("/bianca-advogada.png");
  const [showFields, setShowFields] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoAdvogado(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFoto = () => {
    setFotoAdvogado(null);
  };

  const generatePNG = async () => {
    setIsGenerating(true);
    
    try {
      const element = document.getElementById("oab-template");
      if (!element) {
        alert("Erro: Template não encontrado");
        setIsGenerating(false);
        return;
      }

      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 800,
        windowHeight: 600
      });

      // Criar um canvas temporário com dimensões exatas
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = 1600; // 800 * 2 (scale)
      finalCanvas.height = 1200; // 600 * 2 (scale)
      const ctx = finalCanvas.getContext('2d');
      
      if (ctx) {
        // Preencher fundo branco
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        // Desenhar o canvas capturado
        ctx.drawImage(canvas, 0, 0);
      }

      // Converter para blob
      finalCanvas.toBlob((blob) => {
        if (!blob) {
          alert("Erro ao gerar imagem");
          setIsGenerating(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `OACA_${formData.numeroOAB.replace(/[\/\.]/g, "_")}.png`;
        link.href = url;
        link.click();
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
        setIsGenerating(false);
      }, "image/png", 1.0);

    } catch (error) {
      console.error("Erro ao gerar PNG:", error);
      alert("Erro ao gerar PNG. Verifique o console para mais detalhes.");
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Gerador de Documentos OACA
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Clique em "Editar Dados" para preencher as informações do documento
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setShowFields(!showFields)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            <Edit3 className="w-5 h-5" />
            {showFields ? "Ocultar Dados" : "Editar Dados"}
          </button>
          <button
            onClick={generatePNG}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Baixar PNG
              </>
            )}
          </button>
        </div>

        {/* Campos de edição (expansível) */}
        {showFields && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Foto do Advogado (3:4)
                </label>
                {fotoAdvogado ? (
                  <div className="relative inline-block">
                    <img 
                      src={fotoAdvogado} 
                      alt="Preview" 
                      className="w-32 h-40 object-cover rounded-lg border-2 border-blue-600"
                    />
                    <button
                      onClick={removeFoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Clique para fazer upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Número OACA
                </label>
                <input
                  type="text"
                  name="numeroOAB"
                  value={formData.numeroOAB}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="123.456/CDA"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="nomeAdvogado"
                  value={formData.nomeAdvogado}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Nome do Advogado"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Passaporte
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="3298"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Estado OACA
                </label>
                <input
                  type="text"
                  name="estadoOAB"
                  value={formData.estadoOAB}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="CDA"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Advogado(a)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Template centralizado */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center">
            <OABTemplate {...formData} fotoAdvogado={fotoAdvogado ?? undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}
