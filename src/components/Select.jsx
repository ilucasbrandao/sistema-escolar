import clsx from "clsx";

export function Select({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Selecione...",
    disabled = false,
    error,
    fullWidth = true,
    className = "",
    ...props
}) {
    return (
        <div className={clsx("mb-4", fullWidth && "w-full", className)}>
            {label && (
                <label className="block text-slate-700 font-semibold text-sm mb-2">
                    {label}
                </label>
            )}

            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                {...props}
                className={clsx(
                    "border rounded px-3 py-2 text-slate-800",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                    "transition-colors duration-200",
                    disabled
                        ? "bg-slate-100 cursor-not-allowed text-slate-500"
                        : "bg-white",
                    error ? "border-red-500" : "border-gray-300",
                    fullWidth && "w-full"
                )}
            >
                {placeholder && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}

                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}
