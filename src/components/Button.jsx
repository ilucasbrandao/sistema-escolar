import PropTypes from "prop-types";

const variants = {
    primary: "bg-blue-500/90 text-white hover:bg-blue-500 focus:ring-blue-400",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300",
    success: "bg-green-500/90 text-white hover:bg-green-500 focus:ring-green-400",
    danger: "bg-red-500/90 text-white hover:bg-red-500 focus:ring-red-400",
};

export function Button({ children, variant = "primary", className = "", ...props }) {
    return (
        <button
            {...props}
            className={`
                px-4 py-2 sm:px-5 sm:py-2.5
                rounded-md
                font-medium text-sm sm:text-base
                shadow-sm hover:shadow-md
                active:scale-95
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-offset-1
                ${variants[variant] || variants.primary}
                ${className}
            `}
        >
            {children}
        </button>
    );
}

export function DefaultButton({ children, theme = "primary", ...props }) {
    const baseClass =
        "font-medium py-2.5 px-6 rounded-md text-sm transition-all duration-200 active:scale-95 cursor-pointer";

    const themes = {
        primary: "bg-blue-500/90 text-white hover:bg-blue-500 shadow-sm",
        secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm",
    };

    return (
        <button className={`${baseClass} ${themes[theme]}`} {...props}>
            {children}
        </button>
    );
}

DefaultButton.propTypes = {
    children: PropTypes.node.isRequired,
    theme: PropTypes.string,
};
