import clsx from "clsx";

export function Select({
    id,
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
    const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, "-")}`;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
        <div className={clsx("mb-4", fullWidth && "w-full", className)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-slate-700 font-medium text-sm mb-2"
                >
                    {label}
                </label>
            )}

            <select
                id={selectId}
                value={value}
                onChange={onChange}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={errorId}
                {...props}
                className={clsx(
                    "block w-full bg-white text-slate-800 border rounded-md px-3 py-2",
                    "transition-all duration-200 ease-out",
                    "focus:outline-none focus:ring-2 focus:ring-blue-400",
                    disabled && "bg-slate-100 cursor-not-allowed text-slate-500",
                    error ? "border-red-500" : "border-slate-300"
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

            {error && (
                <p id={errorId} className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
