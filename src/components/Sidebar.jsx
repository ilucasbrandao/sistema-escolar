import { useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    Wallet,
    Bell,
    LogOut,
    Settings,
    Home,
    X
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { count } = useNotifications();

    const menus = [
        { label: "Início", path: "/", icon: Home },
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { label: "Alunos", path: "/alunos", icon: GraduationCap },
        { label: "Professores", path: "/professores", icon: Users },
        { label: "Financeiro", path: "/lancamentos", icon: Wallet },
        { label: "Notificações", path: "/notificacoes", icon: Bell },
    ];

    const handleLogout = () => {
        if (window.confirm("Deseja realmente sair?")) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    const containerClasses = `
        bg-white border-r border-slate-200 flex flex-col h-screen transition-all duration-300
        fixed left-0 top-0 z-50 w-64 shadow-lg md:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
    `;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={containerClasses}>
                <div className="h-24 flex items-center justify-between px-6 border-b border-slate-100">
                    {/* Logo / Nome */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            E
                        </div>
                        <span className="font-bold text-slate-700 tracking-tight hidden sm:block">Espaço ao Pé da Letra</span>
                    </div>

                    {/* Botão fechar (Só aparece no mobile) */}
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navegação */}
                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {menus.map((item) => {
                        const isActive = location.pathname === item.path;

                        // Lógica: Se for o menu Notificações E tiver contagem > 0
                        const showBadge = item.path === "/notificacoes" && count > 0;

                        return (
                            <button
                                key={item.path}
                                onClick={() => { navigate(item.path); onClose(); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-sm relative 
                            ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`
                                }
                            >
                                <item.icon className="w-5 h-5" />

                                <span className="flex-1 text-left">{item.label}</span>

                                {/* --- A BOLINHA MÁGICA 🔴 --- */}
                                {showBadge && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Rodapé */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button className="flex items-center gap-3 text-slate-600 hover:bg-white hover:shadow-sm w-full px-4 py-2.5 rounded-lg transition text-sm font-medium">
                        <Settings className="w-4 h-4 text-slate-400" />
                        Configurações
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-red-600 hover:bg-red-50 w-full px-4 py-2.5 rounded-lg transition mt-1 text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            </aside>

        </>
    );
}