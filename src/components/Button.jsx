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

