"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Scale, 
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingRegistro, setCheckingRegistro] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }

    if (status === "authenticated" && session?.user?.id) {
      fetch("/api/verificar-registro")
        .then(res => res.json())
        .then(data => {
          if (!data.registroCompleto) {
            router.push("/completar-registro");
          } else if (data.statusAprovacao === "pendente") {
            router.push("/aguardando-aprovacao");
          } else if (data.statusAprovacao === "rejeitado") {
            router.push("/aguardando-aprovacao");
          } else if (data.statusAprovacao === "aprovado") {
            setUserData(data.user);
            setCheckingRegistro(false);
          } else {
            setCheckingRegistro(false);
          }
        })
        .catch(error => {
          console.error("Erro ao verificar registro:", error);
          setCheckingRegistro(false);
        });
    }
  }, [status, session, router]);

  if (status === "loading" || checkingRegistro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },

    { name: "Contratações", href: "/dashboard/contratacoes", icon: UserCheck },
    { name: "Cargos", href: "/dashboard/cargos", icon: Shield },
  ];

  const currentPage = navLinks.find(link => link.href === pathname)?.name || "Dashboard";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-50 dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Scale className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">Jurídico</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{userData?.name || session.user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{userData?.cargo || "Cargo não definido"}</p>
            </div>
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-blue-600"
              />
            )}
          </div>
        </div>
        <div className="mx-4 sm:mx-6 lg:mx-8 border-b border-gray-200 dark:border-gray-700"></div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-[73px] bottom-0 left-0 z-40 ${sidebarCollapsed ? 'w-20' : 'w-64'} transform transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center py-6' : 'justify-between px-4 sm:px-6 lg:px-8 py-6'}`}>
          {!sidebarCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 dark:text-white uppercase">{currentPage}</p>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:block text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        <div className={`${sidebarCollapsed ? 'mx-2' : 'mx-4 sm:mx-6 lg:mx-8'} border-b border-gray-200 dark:border-gray-700`}></div>

        <nav className={`${sidebarCollapsed ? 'px-2' : 'px-4 sm:px-6 lg:px-8'} py-4 space-y-2 h-[calc(100vh-73px-85px-73px)] overflow-y-auto`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                title={sidebarCollapsed ? link.name : undefined}
              >
                <Icon className="w-5 h-5" />
                {!sidebarCollapsed && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 ${sidebarCollapsed ? 'px-2' : 'px-4 sm:px-6 lg:px-8'} py-4 border-t border-gray-200 dark:border-gray-700`}>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} w-full py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium`}
            title={sidebarCollapsed ? "Sair" : undefined}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`pt-[73px] transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
