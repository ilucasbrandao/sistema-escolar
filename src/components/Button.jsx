import PropTypes from "prop-types";

const variants = {
    pink: "from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400",
    blue: "from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400",
    green: "from-green-200 to-green-300 hover:from-green-300 hover:to-green-400",
    purple: "from-purple-200 to-purple-300 hover:from-purple-300 hover:to-purple-400",
    yellow: "from-yellow-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400",
};

export function Button({ children, variant = "pink", className = "", ...props }) {
    return (
        <button
            {...props}
            className={`
                px-4 py-2 sm:px-5 sm:py-3
                rounded-xl 
                bg-gradient-to-r ${variants[variant] || variants.pink}
                text-sm sm:text-base text-slate-800 font-semibold 
                shadow-md hover:shadow-lg 
                active:scale-95 
                transition-all duration-300 ease-out 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${variant}
                ${className}
            `}
        >
            {children}
        </button>
    );
}


export function DefaultButton({ children, theme, ...props }) {
    // Base do botão
    const baseClass =
        "font-semibold py-3 px-9 rounded-full text-base transition-all duration-300 transform active:scale-95 active:opacity-80 cursor-pointer";

    // Tema primary
    const primaryClass =
        "bg-gradient-to-r from-blue-400 to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105 hover:opacity-95";

    // Tema secundário (ou transparente)
    const secondaryClass =
        "bg-white/20 text-white border border-white/50 backdrop-blur-sm shadow-sm hover:bg-white/15 hover:border-white/80";


    const themeClass = theme === "primary" ? primaryClass : secondaryClass;

    return (
        <button className={`${baseClass} ${themeClass}`} {...props}>
            {children}
        </button>
    );
}

DefaultButton.propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.string,
};