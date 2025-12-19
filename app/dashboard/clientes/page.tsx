"use client";

import { Users, Plus, Search } from "lucide-react";

export default function ClientesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-green-600" />
            Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie seus clientes e contatos
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          Nenhum cliente cadastrado
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Clique em "Novo Cliente" para começar
        </p>
      </div>
    </div>
  );
}
