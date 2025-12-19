"use client";

import Navbar from "@/components/Navbar";
import { Scale, Shield, Gavel, UserCircle, ArrowRight, CheckCircle, BookOpen, FileText, ScrollText, Heart, Eye, Users, Clock, Briefcase, Building, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";


export default function Home() {
  const teamMembers = [
    {
      name: "Bianca Saito",
      idade: 19,
      role: "Desembargadora",
      icon: Gavel,
      color: "blue",
      initials: "BS"
    },
    {
      name: "A definir",
      role: "Cargo principal",
      icon: Shield,
      description: "Em breve",
      color: "red",
      initials: "?"
    },
    {
      name: "A definir",
      role: "Cargo principal",
      icon: UserCircle,
      description: "Em breve",
      color: "green",
      initials: "?"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-600/5 dark:to-indigo-600/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Scale className="w-4 h-4" />
              Excelência em Gestão Jurídica
            </div>

            {/* Título */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Sistema Jurídico
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cidade dos Anjos
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Modernidade, eficiência e segurança na gestão de processos jurídicos e clientes
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <button
                onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold text-lg cursor-pointer"
              >
                Acessar Sistema
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                href="/quem-somos"
                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold text-lg border border-gray-200 dark:border-gray-700"
              >
                Saiba Mais
              </Link>
            </div>

            {/* Features List */}
            <div className="flex flex-wrap gap-6 justify-center mt-16 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Segurança Garantida</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Gestão Completa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Suporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores e Serviços Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Valores */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Nossos Valores
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Princípios que guiam nossa atuação no sistema judiciário
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-lg">
                <Scale className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Justiça
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Decisões imparciais e equitativas para todos os cidadãos
                </p>
              </div>

              <div className="group p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all hover:shadow-lg">
                <Eye className="w-12 h-12 text-green-600 dark:text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Transparência
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Processos claros e acessíveis à população
                </p>
              </div>

              <div className="group p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:shadow-lg">
                <Heart className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Ética
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Conduta moral e profissional em todas as ações
                </p>
              </div>

              <div className="group p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all hover:shadow-lg">
                <Clock className="w-12 h-12 text-orange-600 dark:text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Agilidade
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Processos rápidos e eficientes para todos
                </p>
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Serviços Oferecidos
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Soluções completas para atender às demandas do sistema judiciário
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl w-fit mb-6">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Processos Jurídicos
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Abertura e acompanhamento de processos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Consulta de andamentos processuais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Gestão de documentos e prazos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Audiências e julgamentos</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500">
                <div className="p-4 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl w-fit mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Atendimento ao Cidadão
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Orientação jurídica básica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Agendamento de atendimentos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Protocolo de petições</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Emissão de certidões</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500">
                <div className="p-4 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl w-fit mb-6">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Gestão Administrativa
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Controle de pautas e agendas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Relatórios e estatísticas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Gestão de recursos humanos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Arquivo digital de documentos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho da seção */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Conheça Nosso Time
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Nossa <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Equipe</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Profissionais experientes e dedicados, comprometidos em oferecer excelência e transparência em cada decisão
            </p>
          </div>

          <div className="space-y-8">
            {/* Desembargadora - Centralizada */}
            <div className="flex justify-center items-center mb-12">
              {(() => {
                const member = teamMembers[0]; // Desembargadora
                const Icon = member.icon;
                const colorClasses = {
                  blue: "from-blue-600 to-blue-700",
                  red: "from-red-600 to-red-700",
                  green: "from-green-600 to-green-700"
                };

                return (
                  <div className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 dark:border-gray-700 w-full max-w-md mx-auto hover:scale-[1.02] hover:border-blue-200 dark:hover:border-blue-800 overflow-hidden">
                    {/* Brilho decorativo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Photo Frame - Imagem real ajustada */}
                    <div className="relative h-96 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 overflow-hidden rounded-t-3xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <img
                        src="/bianca-desembargadora.png"
                        alt="Desembargadora Bianca Saito"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ objectPosition: 'center 20%' }}
                      />
                      
                      {/* Badge de cargo melhorado */}
                      <div className="absolute bottom-6 left-6 right-6 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md rounded-xl px-5 py-3 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-center gap-2">
                          <Gavel className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-7 text-center bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {member.name}
                      </h3>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {member.idade} anos
                        </p>
                      </div>
                    </div>

                    {/* Barra decorativa animada */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colorClasses[member.color as keyof typeof colorClasses]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                  </div>
                );
              })()}
            </div>

            {/* Outros Funcionários - Grid 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {teamMembers.slice(1).map((member, index) => {
                const Icon = member.icon;
                const colorClasses = {
                  blue: "from-blue-600 to-blue-700",
                  red: "from-red-600 to-red-700",
                  green: "from-green-600 to-green-700"
                };

                return (
                  <div
                    key={index}
                    className="group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-gray-100 dark:border-gray-700 hover:scale-[1.02] hover:border-gray-200 dark:hover:border-gray-600"
                  >
                    {/* Brilho de hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-transparent to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Photo Frame - Placeholder */}
                    <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                      {/* Placeholder com iniciais e ícone */}
                      <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${colorClasses[member.color as keyof typeof colorClasses]} opacity-90 group-hover:opacity-100 transition-opacity`}>
                        <div className="text-center group-hover:scale-110 transition-transform duration-500">
                          <div className="text-9xl font-bold text-white/20 mb-4">
                            {member.initials}
                          </div>
                          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
                            <Icon className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Moldura decorativa */}
                      <div className="absolute inset-0 border-8 border-white/10 group-hover:border-white/20 pointer-events-none transition-all" />
                      
                      {/* Badge de cargo */}
                      <div className="absolute bottom-5 left-5 right-5 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                        <p className="text-sm font-bold text-gray-900 dark:text-white text-center uppercase tracking-wide">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 text-center bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-800/50">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">
                        {member.description}
                      </p>
                    </div>

                    {/* Barra decorativa */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colorClasses[member.color as keyof typeof colorClasses]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* View All Team Button */}
          <div className="text-center mt-16">
            <Link
              href="/equipe"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl text-lg"
            >
              <Users className="w-5 h-5" />
              Ver Toda a Equipe
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Legislação Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Legislação e Normas
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Acesse o código penal e toda a legislação vigente da Cidade dos Anjos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Código Penal */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Gavel className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Código Penal
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Atualizado em 2025
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Consulte todas as leis penais, crimes, penas e procedimentos jurídicos estabelecidos pela Cidade dos Anjos.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Crimes e suas respectivas penas</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Procedimentos judiciais</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Direitos e deveres dos cidadãos</span>
                  </li>
                </ul>

                <Link
                  href="/codigo-penal"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg w-full justify-center"
                >
                  <BookOpen className="w-5 h-5" />
                  Acessar Código Penal
                </Link>
              </div>
              
              {/* Decorative border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-700" />
            </div>

            {/* Legislação Municipal */}
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <ScrollText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Legislação Municipal
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Normas e regulamentos
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Todas as leis, decretos, portarias e regulamentos específicos da Cidade dos Anjos em um só lugar.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Leis municipais vigentes</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Decretos e portarias</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Regulamentos administrativos</span>
                  </li>
                </ul>

                <Link
                  href="/legislacao"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg w-full justify-center"
                >
                  <FileText className="w-5 h-5" />
                  Acessar Legislação
                </Link>
              </div>
              
              {/* Decorative border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-indigo-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Consulta de Processos Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Consulta Pública
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Consulte Seu Processo
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Acompanhe o andamento do seu processo de forma rápida e transparente
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Buscar Processo
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Digite o número do processo para consultar
                  </p>
                </div>
              </div>

              <form className="space-y-6">
                <div>
                  <label htmlFor="processo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número do Processo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="processo"
                      placeholder="Ex: 0000000-00.0000.0.00.0000"
                      className="w-full px-4 py-4 pl-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-lg transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Insira o número completo do processo com pontos e hífens
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  <Search className="w-5 h-5" />
                  Consultar Processo
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Informações disponíveis:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Status do processo</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Andamentos recentes</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Próximas audiências</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Partes envolvidas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/processos/novos"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all border border-white/20"
              >
                <FileText className="w-4 h-4" />
                Novos Processos
              </Link>
              <Link
                href="/processos/andamento"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all border border-white/20"
              >
                <Clock className="w-4 h-4" />
                Em Andamento
              </Link>
              <Link
                href="/processos/finalizados"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-all border border-white/20"
              >
                <CheckCircle className="w-4 h-4" />
                Finalizados
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scale className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold text-white">Cidade dos Anjos</span>
          </div>
          <p className="text-sm">
            © 2025 Sistema Jurídico Cidade dos Anjos. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
