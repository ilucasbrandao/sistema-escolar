import { ChevronRight } from "lucide-react";

const NavCard = ({ title, description, icon: Icon, colorClass, onClick }) => (
    <button
        onClick={onClick}
        className="group relative flex flex-col items-start p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left w-full h-full overflow-hidden"
    >
        <div className={`absolute top-0 right-0 p-20 opacity-5 rounded-full -mr-10 -mt-10 transform group-hover:scale-110 transition-transform ${colorClass.replace('text-', 'bg-')}`} />

        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 mb-4`}>
            <Icon className={`w-8 h-8 ${colorClass}`} />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>

        <div className="mt-auto pt-4 flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
            Acessar <ChevronRight className="w-4 h-4 ml-1" />
        </div>
    </button>
);
export default NavCard;