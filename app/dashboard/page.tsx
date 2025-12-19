"use client";

import { useSession } from "next-auth/react";
import { Home } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
        <Home className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Bem-vindo ao Dashboard, {session?.user?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          Página em desenvolvimento
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Este espaço será personalizado com suas estatísticas e ações rápidas
        </p>
      </div>
    </div>
  );
}
