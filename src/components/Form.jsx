import { useEffect, useState } from "react";
import clsx from "clsx";

function BaseInputStyle({ className, ...props }) {
    return clsx(
        `block w-full bg-white text-slate-800 
     border border-slate-300 rounded-md 
     py-2.5 px-3 leading-relaxed
     focus:outline-none focus:ring-2 focus:ring-blue-400 
     transition-colors duration-200`,
        props.disabled && "bg-slate-100 cursor-not-allowed",
        className
    );
}

export function Input({
    id,
    label,
    placeholder,
    type = "text",
    options = [],
    disabled = false,
    error,
    ...props
}) {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-slate-600 font-medium text-sm mb-2"
                >
                    {label}
                </label>
            )}

            {type === "textarea" ? (
                <textarea
                    id={inputId}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...props}
                    className={BaseInputStyle({ className: "resize-none", disabled })}
                />
            ) : type === "select" ? (
                <select
                    id={inputId}
                    disabled={disabled}
                    {...props}
                    className={BaseInputStyle({ disabled })}
                >
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={inputId}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...props}
                    className={BaseInputStyle({ disabled })}
                />
            )}

            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}

export function Form({ fields = [], values, onChange, onSubmit }) {
    const [internalData, setInternalData] = useState({});

    useEffect(() => {
        if (!values) {
            const initial = {};
            fields.forEach((field) => {
                initial[field.name] = field.value || "";
            });
            setInternalData(initial);
        }
    }, [fields, values]);

    const currentValues = values || internalData;
    const setValues = onChange || setInternalData;

    const handleChange = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit && onSubmit(currentValues);
            }}
            className="w-full max-w-2xl mx-auto mt-8 bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-200"
        >
            <div className="flex flex-wrap gap-6 mb-6">
                {fields.map((field, idx) => {
                    if (field.showIf && !field.showIf(currentValues)) return null;

                    return (
                        <div
                            key={idx}
                            className={`w-full ${field.fullWidth ? "" : "md:w-[48%]"}`}
                        >
                            <Input
                                label={field.label}
                                placeholder={field.placeholder}
                                type={field.type}
                                options={field.options}
                                disabled={field.disabled}
                                error={field.error}
                                value={currentValues[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                required={field.required}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="
            px-6 py-2.5 
            rounded-md bg-gray-600 text-white 
            text-sm font-medium 
            shadow-sm hover:bg-gray-700 
            active:scale-95 transition-all
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
          "
                >
                    Salvar
                </button>
            </div>
        </form>
    );
}
