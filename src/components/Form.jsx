export function Input({
    label,
    placeholder,
    type = "text",
    options = [],
    ...props
}) {
    return (
        <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block text-slate-700 font-semibold text-sm mb-2">
                {label}
            </label>

            {type === "textarea" ? (
                <textarea
                    placeholder={placeholder}
                    {...props}
                    className="
            block w-full bg-slate-100 text-slate-800 
            border border-slate-300 rounded-xl 
            py-3 px-4 mb-3 leading-relaxed 
            focus:outline-none focus:bg-white focus:border-pink-300 
            transition-colors duration-200
          "
                />
            ) : type === "select" ? (
                <select
                    {...props}
                    className="
            block w-full bg-slate-100 text-slate-800 
            border border-slate-300 rounded-xl 
            py-3 px-4 mb-3 leading-tight 
            focus:outline-none focus:bg-white focus:border-pink-300
            transition-colors duration-200
          "
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
                    {...props}
                    className="
            block w-full bg-slate-100 text-slate-800 
            border border-slate-300 rounded-xl 
            py-3 px-4 mb-3 leading-tight 
            focus:outline-none focus:bg-white focus:border-pink-300 
            transition-colors duration-200
          "
                />
            )}
        </div>
    );
}

import { useEffect, useState } from "react";

export function Form({ fields = [], onSubmit }) {
    const [formData, setFormData] = useState({});

    // Preenche os valores iniciais quando os campos forem carregados
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
            className="w-full max-w-2xl mx-auto mt-6 sm:mt-8 bg-white p-4 sm:p-6 rounded-2xl shadow-lg"
        >
            <div className="flex flex-wrap -mx-3 mb-6">
                {fields.map((field, idx) => {
                    if (field.showIf && !field.showIf(formData)) return null;

                    return (
                        <div
                            key={idx}
                            className={`w-full ${field.fullWidth ? "" : "md:w-1/2"} px-3 mb-6`}
                        >
                            <Input
                                label={field.label}
                                placeholder={field.placeholder}
                                type={field.type}
                                options={field.options}
                                value={formData[field.name] || ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center">
                <button
                    type="submit"
                    className="
            w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 
            rounded-xl bg-gradient-to-r from-pink-200 to-pink-300 
            text-sm sm:text-base text-slate-800 font-semibold shadow-md 
            hover:from-pink-300 hover:to-pink-400 hover:shadow-lg 
            active:scale-95 transition-all duration-300 ease-out
          "
                >
                    Salvar
                </button>
            </div>
        </form>
    );
}