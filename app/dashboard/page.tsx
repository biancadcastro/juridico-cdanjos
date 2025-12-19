"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Sistema Jurídico
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-300">
              {session.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Bem-vindo, {session.user?.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Email: {session.user?.email}
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Processos Ativos
            </h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-500 mt-2">Nenhum processo cadastrado</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Clientes
            </h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-500 mt-2">Nenhum cliente cadastrado</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Audiências
            </h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-500 mt-2">Nenhuma audiência agendada</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              + Novo Processo
            </button>
            <button className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              + Novo Cliente
            </button>
            <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              + Agendar Audiência
            </button>
            <button className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              📊 Relatórios
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
