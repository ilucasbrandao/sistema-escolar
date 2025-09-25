import PropTypes from "prop-types";
import clsx from "clsx"; // opcional, mas ajuda muito a organizar classes

const variants = {
    primary: "bg-blue-500/90 text-white hover:bg-blue-500 focus:ring-blue-400",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300",
    success: "bg-green-500/90 text-white hover:bg-green-500 focus:ring-green-400",
    danger: "bg-red-500/90 text-white hover:bg-red-500 focus:ring-red-400",
    outline: "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-200",
};

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    ...props
}) {
    return (
        <button
            {...props}
            className={clsx(
                "rounded-md font-medium shadow-sm hover:shadow-md active:scale-95",
                "transition-all duration-200 ease-out",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(Object.keys(variants)),
    size: PropTypes.oneOf(Object.keys(sizes)),
    className: PropTypes.string,
};
