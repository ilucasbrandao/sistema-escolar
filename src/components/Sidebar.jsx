import { useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    GraduationCap, // Para Alunos
    Users,         // Para Professores
    Wallet,
    Bell,
    LogOut,
    Settings,
    Home,
    X,
    BookOpen // <--- Ícone do Diário
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

export function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { count } = useNotifications();

    // 1. DESCOBRIR QUEM É O USUÁRIO
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user.role === "admin";
    const isProfessor = user.role === "professor";

    // 2. DEFINIR OS MENUS COM BASE NO CARGO
    let menus = [];

    if (isAdmin) {
        // --- VISÃO DO ADMIN (TUDO) ---
        menus = [
            { label: "Início", path: "/", icon: Home },
            { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
            { label: "Diário de Classe", path: "/diario-classe", icon: BookOpen }, // <--- NOVO
            { label: "Alunos (Secretaria)", path: "/alunos", icon: GraduationCap },
            { label: "Professores (RH)", path: "/professores", icon: Users },
            { label: "Financeiro", path: "/lancamentos", icon: Wallet },
            { label: "Notificações", path: "/notificacoes", icon: Bell },
        ];
    } else {
        // --- VISÃO DO PROFESSOR (RESTRITA) ---
        menus = [
            { label: "Diário de Classe", path: "/diario-classe", icon: BookOpen }, // <--- HOME DO PROFESSOR
            { label: "Notificações", path: "/notificacoes", icon: Bell },
        ];
    }

    const handleLogout = () => {
        if (window.confirm("Deseja realmente sair?")) {
            localStorage.clear(); // Limpa tudo
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
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            E
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-700 tracking-tight leading-none hidden sm:block">
                                Espaço
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider hidden sm:block">
                                Ao Pé da Letra
                            </span>
                        </div>
                    </div>

                    {/* Botão fechar (Mobile) */}
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* --- PERFIL RÁPIDO NO TOPO (Visual Clean) --- */}
                <div className="px-6 pt-6 pb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Logado como
                    </p>
                    <p className="text-sm font-bold text-slate-700 truncate">
                        {user.nome || "Visitante"}
                    </p>
                    <p className="text-xs text-blue-600 font-medium bg-blue-50 inline-block px-2 py-0.5 rounded-full mt-1 capitalize">
                        {user.role === 'admin' ? 'Administrador' : user.role}
                    </p>
                </div>

                {/* Navegação */}
                <nav className="flex-1 py-4 px-4 space-y-1 overflow-y-auto">
                    {menus.map((item) => {
                        const isActive = location.pathname === item.path;
                        const showBadge = item.path === "/notificacoes" && count > 0;

                        return (
                            <button
                                key={item.path}
                                onClick={() => { navigate(item.path); onClose(); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium text-sm relative 
                                    ${isActive
                                        ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`
                                }
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                                <span className="flex-1 text-left">{item.label}</span>

                                {/* Badge de Notificação */}
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
                    <button className="flex items-center gap-3 text-slate-600 hover:bg-white hover:shadow-sm w-full px-4 py-2.5 rounded-lg transition text-sm font-medium border border-transparent hover:border-slate-200">
                        <Settings className="w-4 h-4 text-slate-400" />
                        Configurações
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-red-600 hover:bg-red-50 hover:border-red-100 w-full px-4 py-2.5 rounded-lg transition mt-2 text-sm font-medium border border-transparent"
                    >
                        <LogOut className="w-4 h-4" />
                        Sair
                    </button>
                </div>
            </aside>
        </>
    );
}