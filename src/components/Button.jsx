import PropTypes from "prop-types";
import clsx from "clsx";

const variants = {
    primary: "bg-[#4AA3B8] text-white hover:bg-[#3c8d9e] focus:ring-[#4AA3B8]/50 shadow-md shadow-[#4AA3B8]/20",
    chalk: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-300",
    paper: "bg-stone-100 text-stone-700 hover:bg-stone-200 focus:ring-stone-300",
    pencil: "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 focus:ring-zinc-400",
    pastelBlue: "bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-300",
    pastelGreen: "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-300",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-200",
    danger: "border border-red-300 text-white bg-red-500 hover:bg-red-600 focus:ring-red-200"
};

const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-base rounded-lg",
    lg: "px-5 py-2.5 text-lg rounded-xl",
};

export function Button({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    className,
    ...props
}) {
    return (
        <button
            type={type}
            {...props}
            className={clsx(
                "inline-flex items-center justify-center gap-2",
                "rounded-lg font-semibold tracking-wide",
                "transition-all duration-150 ease-in-out",
                "focus:outline-none focus:ring-2 focus:ring-offset-1",
                "disabled:opacity-50 disabled:cursor-not-allowed",
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
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    variant: PropTypes.oneOf(Object.keys(variants)),
    size: PropTypes.oneOf(Object.keys(sizes)),
    className: PropTypes.string,
};