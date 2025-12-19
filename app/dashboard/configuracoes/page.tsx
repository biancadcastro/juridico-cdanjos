"use client";

import { Settings, Bell, Lock, User, Palette } from "lucide-react";

export default function ConfiguracoesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Settings className="w-8 h-8 text-gray-600" />
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gerencie as configurações do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Perfil</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Edite suas informações pessoais</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Notificações</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure suas preferências de notificação</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Segurança</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie senha e autenticação</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Palette className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Aparência</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Personalize o tema e cores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
