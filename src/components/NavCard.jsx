import { ChevronRight } from "lucide-react";
import PropTypes from "prop-types";

const NavCard = ({
    title,
    description,
    icon: Icon,
    colorClass = "text-slate-600",
    onClick,
}) => {
    const bgClass = colorClass
        ? colorClass.replace("text-", "bg-")
        : "bg-slate-200";
    return (
        <button
            onClick={onClick}
            className="group relative flex flex-col items-start p-5 sm:p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left w-full h-full overflow-hidden"
        >
            <div
                className={`absolute top-0 right-0 p-20 opacity-5 rounded-full -mr-10 -mt-10 transform group-hover:scale-110 transition-transform ${bgClass}`}
            />

            <div className={`p-3 rounded-xl mb-4 ${colorClass} bg-current/10`}>
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                {title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                {description}
            </p>

            <div className="mt-auto pt-2 flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
                Acessar{" "}
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
        </button>
    );
};

NavCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.elementType.isRequired,
    colorClass: PropTypes.string,
    onClick: PropTypes.func,
};

export default NavCard;
