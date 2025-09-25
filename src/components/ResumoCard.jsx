import clsx from "clsx";

const colors = {
    slate: "text-slate-800",
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
    yellow: "text-yellow-600",
};

const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
};

export function ResumoCard({
    label,
    value,
    color = "slate",
    size = "md",
    prefix,
    suffix,
    className = "",
}) {
    return (
        <div
            className={clsx(
                "bg-white border border-slate-200 rounded-md shadow-sm p-4",
                className
            )}
        >
            <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                {label}
            </p>
            <p
                className={clsx(
                    "mt-1 font-semibold",
                    colors[color] || colors.slate,
                    sizes[size] || sizes.md
                )}
            >
                {prefix && <span className="mr-1">{prefix}</span>}
                {value}
                {suffix && <span className="ml-1">{suffix}</span>}
            </p>
        </div>
    );
}
