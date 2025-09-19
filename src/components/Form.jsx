import { useEffect, useState } from "react";

export function Input({
    label,
    placeholder,
    type = "text",
    options = [],
    disabled = false,
    ...props
}) {
    return (
        <div className="w-full">
            <label className="block text-slate-600 font-medium text-sm mb-2">
                {label}
            </label>

            {type === "textarea" ? (
                <textarea
                    placeholder={placeholder}
                    disabled={disabled}
                    {...props}
                    className={`
                        block w-full bg-white text-slate-800 
                        border border-slate-300 rounded-md 
                        py-2.5 px-3 leading-relaxed
                        focus:outline-none focus:ring-2 focus:ring-blue-400 
                        transition-colors duration-200
                        ${disabled ? "bg-slate-100 cursor-not-allowed" : ""}
                    `}
                />
            ) : type === "select" ? (
                <select
                    disabled={disabled}
                    {...props}
                    className={`
                        block w-full bg-white text-slate-800 
                        border border-slate-300 rounded-md 
                        py-2.5 px-3 leading-tight
                        focus:outline-none focus:ring-2 focus:ring-blue-400
                        transition-colors duration-200
                        ${disabled ? "bg-slate-100 cursor-not-allowed" : ""}
                    `}
                >
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...props}
                    className={`
                        block w-full bg-white text-slate-800 
                        border border-slate-300 rounded-md 
                        py-2.5 px-3 leading-tight
                        focus:outline-none focus:ring-2 focus:ring-blue-400
                        transition-colors duration-200
                        ${disabled ? "bg-slate-100 cursor-not-allowed" : ""}
                    `}
                />
            )}
        </div>
    );
}

export function Form({ fields = [], onSubmit }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const initial = {};
        fields.forEach((field) => {
            initial[field.name] = field.value || "";
        });
        setFormData(initial);
    }, [fields]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit && onSubmit(formData);
            }}
            className="w-full max-w-2xl mx-auto mt-8 bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-200"
        >
            <div className="flex flex-wrap gap-6 mb-6">
                {fields.map((field, idx) => {
                    if (field.showIf && !field.showIf(formData)) return null;

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
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
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
