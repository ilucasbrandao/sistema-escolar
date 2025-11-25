import { Menu, Bell } from "lucide-react";
import { useNotifications } from "../context/NotificationContext"; // <--- Importe
import { useNavigate } from "react-router-dom";

export function MobileHeader({ onOpenMenu }) {
    const { count } = useNotifications();
    const navigate = useNavigate();

    return (
        <div className="md:hidden bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">

            <button onClick={onOpenMenu} className="p-2 text-slate-600">
                <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 text-sm">Espaço ao Pé da Letra</span>
            </div>

            {/* Botão de Sino no Mobile */}
            <button
                onClick={() => navigate("/notificacoes")}
                className="p-2 text-slate-600 relative"
            >
                <Bell className="w-6 h-6" />
                {count > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
            </button>
        </div>
    );
}